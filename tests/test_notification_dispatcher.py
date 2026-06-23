"""Tests for the NotificationDispatcher service."""

import pytest

from src.models.amendment import (
    Notification,
    NotificationChannel,
    NotificationStatus,
)
from src.services.notification_dispatcher import (
    ChannelDispatcher,
    EmailDispatcher,
    InAppDispatcher,
    MSTeamsDispatcher,
    NotificationDispatcher,
)


class FakeFailingDispatcher(ChannelDispatcher):
    """A dispatcher that always fails, for testing error handling."""

    @property
    def channel(self) -> NotificationChannel:
        return NotificationChannel.SMS

    def send(self, notification: Notification) -> bool:
        return False


class FakeExceptionDispatcher(ChannelDispatcher):
    """A dispatcher that raises an exception, for testing error handling."""

    @property
    def channel(self) -> NotificationChannel:
        return NotificationChannel.SMS

    def send(self, notification: Notification) -> bool:
        raise ConnectionError("SMS gateway unavailable")


class TestNotificationDispatcher:
    """Tests for the composite notification dispatcher."""

    def test_dispatch_email_successfully(self, sample_monitors):
        dispatcher = NotificationDispatcher()
        notification = Notification(
            recipient=sample_monitors[0],
            channel=NotificationChannel.EMAIL,
            message_subject="Test",
            message_body="Test body",
        )
        result = dispatcher.dispatch(notification)
        assert result.status == NotificationStatus.SENT
        assert result.sent_at is not None

    def test_dispatch_ms_teams_successfully(self, sample_monitors):
        dispatcher = NotificationDispatcher()
        notification = Notification(
            recipient=sample_monitors[0],
            channel=NotificationChannel.MS_TEAMS,
            message_subject="Test",
            message_body="Test body",
        )
        result = dispatcher.dispatch(notification)
        assert result.status == NotificationStatus.SENT

    def test_dispatch_in_app_successfully(self, sample_monitors):
        dispatcher = NotificationDispatcher()
        notification = Notification(
            recipient=sample_monitors[0],
            channel=NotificationChannel.IN_APP,
        )
        result = dispatcher.dispatch(notification)
        assert result.status == NotificationStatus.SENT

    def test_dispatch_unregistered_channel_fails(self, sample_monitors):
        dispatcher = NotificationDispatcher(dispatchers=[EmailDispatcher()])
        notification = Notification(
            recipient=sample_monitors[0],
            channel=NotificationChannel.SMS,
        )
        result = dispatcher.dispatch(notification)
        assert result.status == NotificationStatus.FAILED
        assert "No dispatcher registered" in result.failure_reason

    def test_dispatch_returns_failure_when_dispatcher_returns_false(
        self, sample_monitors
    ):
        dispatcher = NotificationDispatcher(dispatchers=[FakeFailingDispatcher()])
        notification = Notification(
            recipient=sample_monitors[0],
            channel=NotificationChannel.SMS,
        )
        result = dispatcher.dispatch(notification)
        assert result.status == NotificationStatus.FAILED
        assert result.failure_reason == "Dispatcher returned failure"

    def test_dispatch_handles_exception_gracefully(self, sample_monitors):
        dispatcher = NotificationDispatcher(dispatchers=[FakeExceptionDispatcher()])
        notification = Notification(
            recipient=sample_monitors[0],
            channel=NotificationChannel.SMS,
        )
        result = dispatcher.dispatch(notification)
        assert result.status == NotificationStatus.FAILED
        assert "SMS gateway unavailable" in result.failure_reason

    def test_available_channels(self):
        dispatcher = NotificationDispatcher()
        channels = dispatcher.available_channels
        assert NotificationChannel.EMAIL in channels
        assert NotificationChannel.MS_TEAMS in channels
        assert NotificationChannel.IN_APP in channels
