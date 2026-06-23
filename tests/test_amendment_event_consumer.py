"""Tests for the AmendmentEventConsumer."""

import copy

import pytest

from src.models.amendment import AmendmentType
from src.services.amendment_event_consumer import AmendmentEventConsumer
from src.services.amendment_notification_service import AmendmentNotificationService
from src.services.document_link_builder import DocumentLinkBuilder
from src.services.monitor_registry import InMemoryMonitorRegistry
from src.services.notification_dispatcher import NotificationDispatcher


@pytest.fixture
def notification_service(monitor_registry) -> AmendmentNotificationService:
    return AmendmentNotificationService(
        monitor_registry=monitor_registry,
        link_builder=DocumentLinkBuilder(),
        dispatcher=NotificationDispatcher(),
    )


@pytest.fixture
def consumer(notification_service) -> AmendmentEventConsumer:
    return AmendmentEventConsumer(notification_service=notification_service)


class TestAmendmentEventConsumer:
    """Tests for event deserialization and processing."""

    def test_handle_valid_event(self, consumer, sample_event):
        """Processes a valid amendment event end-to-end."""
        result = consumer.handle_event(sample_event)
        assert result.success is True
        assert result.event_id == "EVT-12345"
        assert result.notification_result is not None
        assert result.notification_result.total_monitors == 3

    def test_handle_event_with_wrong_type(self, consumer, sample_event):
        event = copy.deepcopy(sample_event)
        event["event_type"] = "patient_enrolled"
        result = consumer.handle_event(event)
        assert result.success is False
        assert "Unexpected event type" in result.error

    def test_handle_event_with_missing_payload(self, consumer):
        event = {
            "event_id": "EVT-BAD",
            "event_type": "protocol_amendment_published",
        }
        result = consumer.handle_event(event)
        assert result.success is False
        assert result.error is not None

    def test_handle_event_with_missing_study(self, consumer, sample_event):
        event = copy.deepcopy(sample_event)
        del event["payload"]["study"]
        result = consumer.handle_event(event)
        assert result.success is False

    def test_handle_event_with_missing_document(self, consumer, sample_event):
        event = copy.deepcopy(sample_event)
        del event["payload"]["document"]
        result = consumer.handle_event(event)
        assert result.success is False

    def test_handle_event_with_invalid_amendment_type(self, consumer, sample_event):
        event = copy.deepcopy(sample_event)
        event["payload"]["amendment_type"] = "invalid_type"
        result = consumer.handle_event(event)
        assert result.success is False

    def test_handle_event_without_effective_date(self, consumer, sample_event):
        event = copy.deepcopy(sample_event)
        event["payload"]["effective_date"] = None
        result = consumer.handle_event(event)
        assert result.success is True

    def test_handle_event_without_previous_version(self, consumer, sample_event):
        event = copy.deepcopy(sample_event)
        del event["payload"]["previous_version"]
        result = consumer.handle_event(event)
        assert result.success is True

    def test_deserialized_amendment_has_correct_fields(self, consumer, sample_event):
        result = consumer.handle_event(sample_event)
        assert result.success is True
        nr = result.notification_result
        # Verify the amendment was correctly deserialized by checking
        # what ended up in the notifications
        notification = nr.notifications[0]
        assert "2.0" in notification.message_subject
        assert "BEACON Phase III" in notification.message_subject

    def test_handle_event_with_missing_event_id(self, consumer, sample_event):
        event = copy.deepcopy(sample_event)
        del event["event_id"]
        result = consumer.handle_event(event)
        assert result.event_id == "unknown"
        assert result.success is True  # Missing event_id shouldn't block processing
