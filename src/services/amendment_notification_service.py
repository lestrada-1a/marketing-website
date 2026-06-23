"""Core service that orchestrates protocol amendment notifications.

This is the main entry point for processing protocol amendment events.
When a protocol amendment is published, this service:

1. Looks up all Medical Monitors assigned to the study
2. Generates a deep link to the amendment document in the data lake
3. Builds a notification for each monitor with the amendment details
4. Dispatches notifications via each monitor's preferred channels
5. Returns an audit-friendly result of all notification attempts

The service is designed to meet the <2 minute delivery SLA defined in
the acceptance criteria for DSE-4.
"""

from __future__ import annotations

import logging
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Sequence

from src.models.amendment import (
    MedicalMonitor,
    Notification,
    NotificationChannel,
    NotificationStatus,
    ProtocolAmendment,
)
from src.services.document_link_builder import DocumentLinkBuilder
from src.services.monitor_registry import MonitorRegistryProtocol
from src.services.notification_dispatcher import NotificationDispatcher

logger = logging.getLogger(__name__)


@dataclass
class NotificationResult:
    """Summary of notification delivery for a single amendment event."""

    amendment_id: str
    study_id: str
    total_monitors: int
    total_notifications_sent: int
    total_notifications_failed: int
    notifications: list[Notification]
    processed_at: datetime

    @property
    def all_succeeded(self) -> bool:
        return self.total_notifications_failed == 0 and self.total_notifications_sent > 0

    @property
    def has_failures(self) -> bool:
        return self.total_notifications_failed > 0


class AmendmentNotificationService:
    """Orchestrates the end-to-end notification flow for protocol amendments.

    This service satisfies all acceptance criteria for DSE-4:
    - AC1: Designed for event-driven triggering within 2 minutes of publication
    - AC2: Includes amendment version number and summary of changes in notification
    - AC3: Deep link to amendment document in the study data lake
    - AC4: Notification sent to all assigned Medical Monitors for the study
    """

    SUBJECT_TEMPLATE = (
        "Protocol Amendment {version} — {study_name} ({protocol_number})"
    )

    BODY_TEMPLATE = (
        "A protocol amendment has been issued for your study.\n\n"
        "Study: {study_name} ({protocol_number})\n"
        "Amendment Version: {version}\n"
        "Amendment Type: {amendment_type}\n"
        "Published: {published_at}\n\n"
        "Summary of Changes:\n{summary}\n\n"
        "Review the amendment document:\n{document_link}\n\n"
        "Please review the changes and assess the impact on ongoing patient treatments."
    )

    def __init__(
        self,
        monitor_registry: MonitorRegistryProtocol,
        link_builder: DocumentLinkBuilder | None = None,
        dispatcher: NotificationDispatcher | None = None,
    ) -> None:
        self._monitor_registry = monitor_registry
        self._link_builder = link_builder or DocumentLinkBuilder()
        self._dispatcher = dispatcher or NotificationDispatcher()

    def process_amendment(
        self, amendment: ProtocolAmendment
    ) -> NotificationResult:
        """Process a protocol amendment and notify all assigned Medical Monitors.

        This is the main entry point called when a protocol amendment event
        is received.  It performs the full notification workflow:

        1. Resolve monitors assigned to the study
        2. Generate the deep link to the amendment document
        3. Build and dispatch a notification per monitor per channel
        4. Return an aggregate result for audit logging

        Args:
            amendment: The protocol amendment to notify about.

        Returns:
            A NotificationResult summarising all delivery attempts.
        """
        study_id = amendment.study.study_id
        logger.info(
            "Processing amendment %s (v%s) for study %s",
            amendment.amendment_id,
            amendment.version_number,
            study_id,
        )

        # 1. Look up all Medical Monitors for this study (AC4)
        monitors = self._monitor_registry.get_monitors_for_study(study_id)
        if not monitors:
            logger.warning("No Medical Monitors assigned to study %s", study_id)

        # 2. Generate deep link to the amendment document (AC3)
        document_link = self._link_builder.build_amendment_link(amendment)

        # 3 & 4. Build and dispatch notifications (AC1, AC2)
        all_notifications: list[Notification] = []
        for monitor in monitors:
            monitor_notifications = self._notify_monitor(
                amendment, monitor, document_link
            )
            all_notifications.extend(monitor_notifications)

        # 5. Build audit result
        sent = sum(
            1 for n in all_notifications if n.status == NotificationStatus.SENT
        )
        failed = sum(
            1 for n in all_notifications if n.status == NotificationStatus.FAILED
        )

        result = NotificationResult(
            amendment_id=amendment.amendment_id,
            study_id=study_id,
            total_monitors=len(monitors),
            total_notifications_sent=sent,
            total_notifications_failed=failed,
            notifications=all_notifications,
            processed_at=datetime.now(timezone.utc),
        )

        logger.info(
            "Amendment %s: %d monitors, %d sent, %d failed",
            amendment.amendment_id,
            result.total_monitors,
            sent,
            failed,
        )
        return result

    def _notify_monitor(
        self,
        amendment: ProtocolAmendment,
        monitor: MedicalMonitor,
        document_link: str,
    ) -> list[Notification]:
        """Build and dispatch notifications for a single Medical Monitor.

        A notification is created for each of the monitor's preferred
        channels and dispatched independently.

        Args:
            amendment: The protocol amendment.
            monitor: The Medical Monitor to notify.
            document_link: The deep link to the amendment document.

        Returns:
            List of Notification objects with updated delivery status.
        """
        subject = self.SUBJECT_TEMPLATE.format(
            version=amendment.version_number,
            study_name=amendment.study.study_name,
            protocol_number=amendment.study.protocol_number,
        )

        body = self.BODY_TEMPLATE.format(
            study_name=amendment.study.study_name,
            protocol_number=amendment.study.protocol_number,
            version=amendment.version_number,
            amendment_type=amendment.amendment_type.value,
            published_at=amendment.published_at.strftime("%Y-%m-%d %H:%M UTC"),
            summary=amendment.summary_of_changes,
            document_link=document_link,
        )

        notifications: list[Notification] = []
        for channel in monitor.preferred_channels:
            notification = Notification(
                notification_id=str(uuid.uuid4()),
                amendment=amendment,
                recipient=monitor,
                channel=channel,
                status=NotificationStatus.PENDING,
                document_link=document_link,
                message_subject=subject,
                message_body=body,
            )
            dispatched = self._dispatcher.dispatch(notification)
            notifications.append(dispatched)

        return notifications
