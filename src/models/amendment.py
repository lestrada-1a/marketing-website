"""Data models for protocol amendments and related entities."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Optional


class AmendmentType(Enum):
    """Classification of protocol amendment types."""

    SUBSTANTIAL = "substantial"
    NON_SUBSTANTIAL = "non_substantial"
    ADMINISTRATIVE = "administrative"
    SAFETY = "safety"


class NotificationChannel(Enum):
    """Supported notification delivery channels."""

    EMAIL = "email"
    MS_TEAMS = "ms_teams"
    IN_APP = "in_app"
    SMS = "sms"


class NotificationStatus(Enum):
    """Lifecycle status of a notification."""

    PENDING = "pending"
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"
    FAILED = "failed"


@dataclass(frozen=True)
class StudyInfo:
    """Represents a clinical study in the StudyConnect platform."""

    study_id: str
    study_name: str
    protocol_number: str
    sponsor: str


@dataclass(frozen=True)
class MedicalMonitor:
    """A Medical Monitor assigned to oversee a study."""

    monitor_id: str
    name: str
    email: str
    preferred_channels: tuple[NotificationChannel, ...] = (NotificationChannel.EMAIL,)


@dataclass(frozen=True)
class AmendmentDocument:
    """Reference to an amendment document stored in the study data lake."""

    document_id: str
    storage_path: str
    file_name: str
    mime_type: str = "application/pdf"


@dataclass(frozen=True)
class ProtocolAmendment:
    """A protocol amendment event published when a study protocol is amended."""

    amendment_id: str
    study: StudyInfo
    version_number: str
    summary_of_changes: str
    amendment_type: AmendmentType
    document: AmendmentDocument
    published_at: datetime
    effective_date: Optional[datetime] = None
    previous_version: Optional[str] = None

    def __post_init__(self) -> None:
        if not self.version_number:
            raise ValueError("Amendment version_number must not be empty")
        if not self.summary_of_changes:
            raise ValueError("Amendment summary_of_changes must not be empty")


@dataclass
class Notification:
    """A notification record sent to a Medical Monitor."""

    notification_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    amendment: Optional[ProtocolAmendment] = None
    recipient: Optional[MedicalMonitor] = None
    channel: NotificationChannel = NotificationChannel.EMAIL
    status: NotificationStatus = NotificationStatus.PENDING
    document_link: str = ""
    message_subject: str = ""
    message_body: str = ""
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    sent_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    failure_reason: Optional[str] = None
