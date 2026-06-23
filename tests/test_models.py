"""Tests for data models."""

from datetime import datetime, timezone

import pytest

from src.models.amendment import (
    AmendmentDocument,
    AmendmentType,
    MedicalMonitor,
    Notification,
    NotificationChannel,
    NotificationStatus,
    ProtocolAmendment,
    StudyInfo,
)


class TestProtocolAmendment:
    """Tests for the ProtocolAmendment model."""

    def test_create_valid_amendment(self, sample_amendment):
        assert sample_amendment.amendment_id == "AMD-001"
        assert sample_amendment.version_number == "2.0"
        assert sample_amendment.amendment_type == AmendmentType.SUBSTANTIAL
        assert sample_amendment.previous_version == "1.0"
        assert sample_amendment.study.study_id == "STUDY-001"
        assert sample_amendment.document.document_id == "DOC-ABC-123"

    def test_amendment_requires_version_number(self, sample_study, sample_document):
        with pytest.raises(ValueError, match="version_number must not be empty"):
            ProtocolAmendment(
                amendment_id="AMD-002",
                study=sample_study,
                version_number="",
                summary_of_changes="Some changes",
                amendment_type=AmendmentType.ADMINISTRATIVE,
                document=sample_document,
                published_at=datetime.now(timezone.utc),
            )

    def test_amendment_requires_summary(self, sample_study, sample_document):
        with pytest.raises(ValueError, match="summary_of_changes must not be empty"):
            ProtocolAmendment(
                amendment_id="AMD-003",
                study=sample_study,
                version_number="3.0",
                summary_of_changes="",
                amendment_type=AmendmentType.NON_SUBSTANTIAL,
                document=sample_document,
                published_at=datetime.now(timezone.utc),
            )

    def test_amendment_is_immutable(self, sample_amendment):
        with pytest.raises(AttributeError):
            sample_amendment.version_number = "3.0"


class TestNotification:
    """Tests for the Notification model."""

    def test_default_notification_status_is_pending(self):
        notification = Notification()
        assert notification.status == NotificationStatus.PENDING

    def test_notification_has_unique_id(self):
        n1 = Notification()
        n2 = Notification()
        assert n1.notification_id != n2.notification_id

    def test_notification_fields_are_mutable(self, sample_amendment, sample_monitors):
        notification = Notification(
            amendment=sample_amendment,
            recipient=sample_monitors[0],
            channel=NotificationChannel.EMAIL,
        )
        notification.status = NotificationStatus.SENT
        assert notification.status == NotificationStatus.SENT


class TestMedicalMonitor:
    """Tests for the MedicalMonitor model."""

    def test_default_channel_is_email(self):
        monitor = MedicalMonitor(
            monitor_id="MON-099",
            name="Dr. Test",
            email="test@example.com",
        )
        assert monitor.preferred_channels == (NotificationChannel.EMAIL,)

    def test_multiple_preferred_channels(self, sample_monitors):
        carol = sample_monitors[2]
        assert NotificationChannel.EMAIL in carol.preferred_channels
        assert NotificationChannel.MS_TEAMS in carol.preferred_channels
        assert NotificationChannel.IN_APP in carol.preferred_channels


class TestAmendmentType:
    """Tests for the AmendmentType enum."""

    def test_all_types_defined(self):
        assert len(AmendmentType) == 4
        assert AmendmentType.SUBSTANTIAL.value == "substantial"
        assert AmendmentType.NON_SUBSTANTIAL.value == "non_substantial"
        assert AmendmentType.ADMINISTRATIVE.value == "administrative"
        assert AmendmentType.SAFETY.value == "safety"
