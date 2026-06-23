"""Shared test fixtures for the protocol amendment notification service."""

from __future__ import annotations

from datetime import datetime, timezone

import pytest

from src.models.amendment import (
    AmendmentDocument,
    AmendmentType,
    MedicalMonitor,
    NotificationChannel,
    ProtocolAmendment,
    StudyInfo,
)
from src.services.document_link_builder import DocumentLinkBuilder
from src.services.monitor_registry import InMemoryMonitorRegistry
from src.services.notification_dispatcher import NotificationDispatcher


@pytest.fixture
def sample_study() -> StudyInfo:
    return StudyInfo(
        study_id="STUDY-001",
        study_name="BEACON Phase III",
        protocol_number="PROT-2026-001",
        sponsor="Acme Pharma",
    )


@pytest.fixture
def sample_document() -> AmendmentDocument:
    return AmendmentDocument(
        document_id="DOC-ABC-123",
        storage_path="/acme-pharma/STUDY-001/amendments/DOC-ABC-123/amendment_v2.0.pdf",
        file_name="amendment_v2.0.pdf",
        mime_type="application/pdf",
    )


@pytest.fixture
def sample_amendment(sample_study, sample_document) -> ProtocolAmendment:
    return ProtocolAmendment(
        amendment_id="AMD-001",
        study=sample_study,
        version_number="2.0",
        summary_of_changes=(
            "Updated inclusion criteria to allow patients aged 16+. "
            "Added new secondary endpoint for progression-free survival."
        ),
        amendment_type=AmendmentType.SUBSTANTIAL,
        document=sample_document,
        published_at=datetime(2026, 6, 23, 10, 0, 0, tzinfo=timezone.utc),
        previous_version="1.0",
    )


@pytest.fixture
def sample_monitors() -> list[MedicalMonitor]:
    return [
        MedicalMonitor(
            monitor_id="MON-001",
            name="Dr. Alice Chen",
            email="alice.chen@studyconnect.example.com",
            preferred_channels=(NotificationChannel.EMAIL, NotificationChannel.IN_APP),
        ),
        MedicalMonitor(
            monitor_id="MON-002",
            name="Dr. Bob Martinez",
            email="bob.martinez@studyconnect.example.com",
            preferred_channels=(NotificationChannel.EMAIL,),
        ),
        MedicalMonitor(
            monitor_id="MON-003",
            name="Dr. Carol Okafor",
            email="carol.okafor@studyconnect.example.com",
            preferred_channels=(
                NotificationChannel.EMAIL,
                NotificationChannel.MS_TEAMS,
                NotificationChannel.IN_APP,
            ),
        ),
    ]


@pytest.fixture
def monitor_registry(sample_monitors) -> InMemoryMonitorRegistry:
    registry = InMemoryMonitorRegistry()
    for monitor in sample_monitors:
        registry.assign_monitor("STUDY-001", monitor)
    return registry


@pytest.fixture
def link_builder() -> DocumentLinkBuilder:
    return DocumentLinkBuilder(base_url="https://datalake.studyconnect.internal")


@pytest.fixture
def dispatcher() -> NotificationDispatcher:
    return NotificationDispatcher()


@pytest.fixture
def sample_event() -> dict:
    """A sample raw event as received from the message broker."""
    return {
        "event_id": "EVT-12345",
        "event_type": "protocol_amendment_published",
        "timestamp": "2026-06-23T10:00:00+00:00",
        "payload": {
            "amendment_id": "AMD-001",
            "version_number": "2.0",
            "summary_of_changes": (
                "Updated inclusion criteria to allow patients aged 16+. "
                "Added new secondary endpoint for progression-free survival."
            ),
            "amendment_type": "substantial",
            "previous_version": "1.0",
            "published_at": "2026-06-23T10:00:00+00:00",
            "effective_date": "2026-07-01T00:00:00+00:00",
            "study": {
                "study_id": "STUDY-001",
                "study_name": "BEACON Phase III",
                "protocol_number": "PROT-2026-001",
                "sponsor": "Acme Pharma",
            },
            "document": {
                "document_id": "DOC-ABC-123",
                "storage_path": "/acme-pharma/STUDY-001/amendments/DOC-ABC-123/amendment_v2.0.pdf",
                "file_name": "amendment_v2.0.pdf",
                "mime_type": "application/pdf",
            },
        },
    }
