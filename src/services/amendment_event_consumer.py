"""Event consumer for protocol amendment publication events.

This module listens for protocol amendment events from the message broker
(e.g. Kafka, RabbitMQ, or SQS) and triggers the notification workflow.

The consumer is designed to process events within the 2-minute SLA
defined in DSE-4 acceptance criteria.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Callable, Protocol

from src.models.amendment import (
    AmendmentDocument,
    AmendmentType,
    ProtocolAmendment,
    StudyInfo,
)
from src.services.amendment_notification_service import (
    AmendmentNotificationService,
    NotificationResult,
)

logger = logging.getLogger(__name__)


class MessageBrokerConsumer(Protocol):
    """Interface for message broker consumers."""

    def subscribe(self, topic: str, handler: Callable[[dict[str, Any]], None]) -> None:
        """Subscribe to a topic with a message handler."""
        ...  # pragma: no cover

    def start(self) -> None:
        """Start consuming messages."""
        ...  # pragma: no cover

    def stop(self) -> None:
        """Stop consuming messages."""
        ...  # pragma: no cover


@dataclass
class EventProcessingResult:
    """Result of processing a single amendment event."""

    event_id: str
    success: bool
    notification_result: NotificationResult | None = None
    error: str | None = None


class AmendmentEventConsumer:
    """Consumes protocol amendment events and triggers notifications.

    This consumer listens on the configured topic for amendment publication
    events, deserializes them into ProtocolAmendment objects, and delegates
    to the AmendmentNotificationService for notification delivery.

    Event Schema (expected JSON payload):
    {
        "event_id": "string",
        "event_type": "protocol_amendment_published",
        "timestamp": "ISO-8601",
        "payload": {
            "amendment_id": "string",
            "version_number": "string",
            "summary_of_changes": "string",
            "amendment_type": "substantial|non_substantial|administrative|safety",
            "previous_version": "string|null",
            "published_at": "ISO-8601",
            "effective_date": "ISO-8601|null",
            "study": {
                "study_id": "string",
                "study_name": "string",
                "protocol_number": "string",
                "sponsor": "string"
            },
            "document": {
                "document_id": "string",
                "storage_path": "string",
                "file_name": "string",
                "mime_type": "string"
            }
        }
    }
    """

    TOPIC = "studyconnect.protocol.amendments"
    EXPECTED_EVENT_TYPE = "protocol_amendment_published"

    def __init__(
        self,
        notification_service: AmendmentNotificationService,
        broker: MessageBrokerConsumer | None = None,
    ) -> None:
        self._notification_service = notification_service
        self._broker = broker

    def handle_event(self, event_data: dict[str, Any]) -> EventProcessingResult:
        """Handle a raw amendment event from the message broker.

        Validates the event structure, deserializes it into domain objects,
        and delegates to the notification service.

        Args:
            event_data: The raw event dictionary from the message broker.

        Returns:
            An EventProcessingResult indicating success or failure.
        """
        event_id = event_data.get("event_id", "unknown")

        try:
            # Validate event type
            event_type = event_data.get("event_type")
            if event_type != self.EXPECTED_EVENT_TYPE:
                logger.warning(
                    "Ignoring event %s with unexpected type: %s",
                    event_id,
                    event_type,
                )
                return EventProcessingResult(
                    event_id=event_id,
                    success=False,
                    error=f"Unexpected event type: {event_type}",
                )

            # Deserialize
            amendment = self._deserialize_amendment(event_data["payload"])

            # Process
            result = self._notification_service.process_amendment(amendment)

            logger.info(
                "Successfully processed event %s for amendment %s",
                event_id,
                amendment.amendment_id,
            )

            return EventProcessingResult(
                event_id=event_id,
                success=True,
                notification_result=result,
            )

        except (KeyError, ValueError) as exc:
            logger.exception("Failed to process event %s", event_id)
            return EventProcessingResult(
                event_id=event_id,
                success=False,
                error=str(exc),
            )

    def _deserialize_amendment(
        self, payload: dict[str, Any]
    ) -> ProtocolAmendment:
        """Deserialize a JSON payload into a ProtocolAmendment.

        Args:
            payload: The event payload dictionary.

        Returns:
            A ProtocolAmendment domain object.

        Raises:
            KeyError: If required fields are missing.
            ValueError: If field values are invalid.
        """
        study_data = payload["study"]
        study = StudyInfo(
            study_id=study_data["study_id"],
            study_name=study_data["study_name"],
            protocol_number=study_data["protocol_number"],
            sponsor=study_data["sponsor"],
        )

        doc_data = payload["document"]
        document = AmendmentDocument(
            document_id=doc_data["document_id"],
            storage_path=doc_data["storage_path"],
            file_name=doc_data["file_name"],
            mime_type=doc_data.get("mime_type", "application/pdf"),
        )

        published_at = datetime.fromisoformat(payload["published_at"])
        effective_date = None
        if payload.get("effective_date"):
            effective_date = datetime.fromisoformat(payload["effective_date"])

        return ProtocolAmendment(
            amendment_id=payload["amendment_id"],
            study=study,
            version_number=payload["version_number"],
            summary_of_changes=payload["summary_of_changes"],
            amendment_type=AmendmentType(payload["amendment_type"]),
            document=document,
            published_at=published_at,
            effective_date=effective_date,
            previous_version=payload.get("previous_version"),
        )

    def start(self) -> None:
        """Start consuming amendment events from the message broker."""
        if self._broker is not None:
            self._broker.subscribe(self.TOPIC, self.handle_event)
            self._broker.start()
            logger.info("Started consuming events on topic %s", self.TOPIC)

    def stop(self) -> None:
        """Stop consuming amendment events."""
        if self._broker is not None:
            self._broker.stop()
            logger.info("Stopped consuming events")
