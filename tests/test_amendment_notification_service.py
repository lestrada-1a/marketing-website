"""Tests for the AmendmentNotificationService — the core orchestrator."""

import pytest

from src.models.amendment import (
    NotificationChannel,
    NotificationStatus,
)
from src.services.amendment_notification_service import (
    AmendmentNotificationService,
    NotificationResult,
)
from src.services.document_link_builder import DocumentLinkBuilder
from src.services.monitor_registry import InMemoryMonitorRegistry
from src.services.notification_dispatcher import NotificationDispatcher


class TestAmendmentNotificationService:
    """Integration-style tests for the amendment notification orchestrator."""

    def _build_service(
        self, monitor_registry, link_builder=None, dispatcher=None
    ) -> AmendmentNotificationService:
        return AmendmentNotificationService(
            monitor_registry=monitor_registry,
            link_builder=link_builder or DocumentLinkBuilder(),
            dispatcher=dispatcher or NotificationDispatcher(),
        )

    def test_process_amendment_notifies_all_monitors(
        self, sample_amendment, monitor_registry, sample_monitors
    ):
        """AC4: Notification sent to all assigned Medical Monitors for that study."""
        service = self._build_service(monitor_registry)
        result = service.process_amendment(sample_amendment)

        assert result.total_monitors == 3
        assert result.amendment_id == "AMD-001"
        assert result.study_id == "STUDY-001"

        # Each monitor gets one notification per preferred channel
        # MON-001: email + in_app = 2
        # MON-002: email = 1
        # MON-003: email + ms_teams + in_app = 3
        # Total = 6
        assert len(result.notifications) == 6

    def test_all_notifications_contain_document_link(
        self, sample_amendment, monitor_registry
    ):
        """AC3: Deep link to amendment document in the study data lake."""
        service = self._build_service(monitor_registry)
        result = service.process_amendment(sample_amendment)

        for notification in result.notifications:
            assert notification.document_link != ""
            assert "STUDY-001" in notification.document_link
            assert "DOC-ABC-123" in notification.document_link

    def test_notifications_contain_version_and_summary(
        self, sample_amendment, monitor_registry
    ):
        """AC2: Includes amendment version number and summary of changes."""
        service = self._build_service(monitor_registry)
        result = service.process_amendment(sample_amendment)

        for notification in result.notifications:
            assert "2.0" in notification.message_subject
            assert "BEACON Phase III" in notification.message_subject
            assert "Updated inclusion criteria" in notification.message_body
            assert "2.0" in notification.message_body

    def test_all_notifications_sent_successfully(
        self, sample_amendment, monitor_registry
    ):
        """All notifications should be dispatched successfully."""
        service = self._build_service(monitor_registry)
        result = service.process_amendment(sample_amendment)

        assert result.all_succeeded is True
        assert result.has_failures is False
        assert result.total_notifications_sent == 6
        assert result.total_notifications_failed == 0

    def test_process_amendment_with_no_monitors(
        self, sample_amendment
    ):
        """Handles the case where no monitors are assigned to the study."""
        empty_registry = InMemoryMonitorRegistry()
        service = self._build_service(empty_registry)
        result = service.process_amendment(sample_amendment)

        assert result.total_monitors == 0
        assert result.total_notifications_sent == 0
        assert len(result.notifications) == 0
        assert result.all_succeeded is False  # No notifications sent

    def test_notification_respects_preferred_channels(
        self, sample_amendment, monitor_registry, sample_monitors
    ):
        """Each monitor should receive notifications on their preferred channels."""
        service = self._build_service(monitor_registry)
        result = service.process_amendment(sample_amendment)

        # Group notifications by recipient
        by_recipient: dict[str, list] = {}
        for n in result.notifications:
            mid = n.recipient.monitor_id
            by_recipient.setdefault(mid, []).append(n)

        # MON-001 prefers email + in_app
        mon1_channels = {n.channel for n in by_recipient["MON-001"]}
        assert mon1_channels == {NotificationChannel.EMAIL, NotificationChannel.IN_APP}

        # MON-002 prefers email only
        mon2_channels = {n.channel for n in by_recipient["MON-002"]}
        assert mon2_channels == {NotificationChannel.EMAIL}

        # MON-003 prefers email + ms_teams + in_app
        mon3_channels = {n.channel for n in by_recipient["MON-003"]}
        assert mon3_channels == {
            NotificationChannel.EMAIL,
            NotificationChannel.MS_TEAMS,
            NotificationChannel.IN_APP,
        }

    def test_notification_result_has_processed_timestamp(
        self, sample_amendment, monitor_registry
    ):
        service = self._build_service(monitor_registry)
        result = service.process_amendment(sample_amendment)
        assert result.processed_at is not None

    def test_notification_body_includes_amendment_type(
        self, sample_amendment, monitor_registry
    ):
        service = self._build_service(monitor_registry)
        result = service.process_amendment(sample_amendment)
        for notification in result.notifications:
            assert "substantial" in notification.message_body

    def test_custom_data_lake_url(
        self, sample_amendment, monitor_registry
    ):
        """Supports configurable data lake base URLs."""
        custom_builder = DocumentLinkBuilder(
            base_url="https://custom-lake.example.com"
        )
        service = self._build_service(monitor_registry, link_builder=custom_builder)
        result = service.process_amendment(sample_amendment)

        for notification in result.notifications:
            assert notification.document_link.startswith(
                "https://custom-lake.example.com/"
            )
