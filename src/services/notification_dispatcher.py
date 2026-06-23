"""Dispatches notifications across supported delivery channels.

Each channel (email, MS Teams, in-app, SMS) has its own dispatcher
implementation.  The composite dispatcher fans out a notification to
the recipient's preferred channels.
"""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Protocol, Sequence

from src.models.amendment import (
    Notification,
    NotificationChannel,
    NotificationStatus,
)

logger = logging.getLogger(__name__)


class ChannelDispatcher(ABC):
    """Base class for channel-specific notification dispatchers."""

    @property
    @abstractmethod
    def channel(self) -> NotificationChannel:
        """The channel this dispatcher handles."""
        ...  # pragma: no cover

    @abstractmethod
    def send(self, notification: Notification) -> bool:
        """Send a notification via this channel.

        Args:
            notification: The notification to send.

        Returns:
            True if the notification was sent successfully.
        """
        ...  # pragma: no cover


class EmailDispatcher(ChannelDispatcher):
    """Sends notifications via email (stub implementation)."""

    @property
    def channel(self) -> NotificationChannel:
        return NotificationChannel.EMAIL

    def send(self, notification: Notification) -> bool:
        logger.info(
            "Sending email to %s: %s",
            notification.recipient.email if notification.recipient else "unknown",
            notification.message_subject,
        )
        # In production: integrate with email gateway (SES, SendGrid, etc.)
        return True


class MSTeamsDispatcher(ChannelDispatcher):
    """Sends notifications via MS Teams webhook (stub implementation)."""

    @property
    def channel(self) -> NotificationChannel:
        return NotificationChannel.MS_TEAMS

    def send(self, notification: Notification) -> bool:
        logger.info(
            "Sending MS Teams notification to %s",
            notification.recipient.name if notification.recipient else "unknown",
        )
        # In production: POST to MS Teams webhook connector
        return True


class InAppDispatcher(ChannelDispatcher):
    """Sends in-app notifications (stub implementation)."""

    @property
    def channel(self) -> NotificationChannel:
        return NotificationChannel.IN_APP

    def send(self, notification: Notification) -> bool:
        logger.info(
            "Sending in-app notification to %s",
            notification.recipient.name if notification.recipient else "unknown",
        )
        # In production: write to notification inbox / push via WebSocket
        return True


class NotificationDispatcher:
    """Composite dispatcher that sends notifications to all preferred channels.

    This dispatcher fans out each notification to the recipient's preferred
    channels and records the delivery status on each notification.
    """

    def __init__(self, dispatchers: Sequence[ChannelDispatcher] | None = None) -> None:
        if dispatchers is None:
            dispatchers = [EmailDispatcher(), MSTeamsDispatcher(), InAppDispatcher()]
        self._dispatchers = {d.channel: d for d in dispatchers}

    @property
    def available_channels(self) -> set[NotificationChannel]:
        return set(self._dispatchers.keys())

    def dispatch(self, notification: Notification) -> Notification:
        """Send a notification via its assigned channel.

        Updates the notification status and timestamps based on success or
        failure of delivery.

        Args:
            notification: The notification to dispatch.

        Returns:
            The updated notification with delivery status.
        """
        dispatcher = self._dispatchers.get(notification.channel)

        if dispatcher is None:
            notification.status = NotificationStatus.FAILED
            notification.failure_reason = (
                f"No dispatcher registered for channel {notification.channel.value}"
            )
            logger.warning(
                "No dispatcher for channel %s", notification.channel.value
            )
            return notification

        try:
            success = dispatcher.send(notification)
            now = datetime.now(timezone.utc)
            if success:
                notification.status = NotificationStatus.SENT
                notification.sent_at = now
            else:
                notification.status = NotificationStatus.FAILED
                notification.failure_reason = "Dispatcher returned failure"
        except Exception as exc:
            notification.status = NotificationStatus.FAILED
            notification.failure_reason = str(exc)
            logger.exception(
                "Failed to dispatch notification %s via %s",
                notification.notification_id,
                notification.channel.value,
            )

        return notification
