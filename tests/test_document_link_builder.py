"""Tests for the DocumentLinkBuilder service."""

import pytest

from src.services.document_link_builder import DocumentLinkBuilder
from src.models.amendment import (
    AmendmentDocument,
    AmendmentType,
    ProtocolAmendment,
    StudyInfo,
)
from datetime import datetime, timezone


class TestDocumentLinkBuilder:
    """Tests for deep link generation to amendment documents."""

    def test_build_amendment_link_produces_correct_url(
        self, sample_amendment, link_builder
    ):
        """AC3: Deep link to amendment document in the study data lake."""
        link = link_builder.build_amendment_link(sample_amendment)
        assert link == (
            "https://datalake.studyconnect.internal/"
            "studies/STUDY-001/amendments/DOC-ABC-123/amendment_v2.0.pdf"
        )

    def test_build_amendment_link_with_custom_base_url(self, sample_amendment):
        builder = DocumentLinkBuilder(base_url="https://custom.lake.example.com")
        link = builder.build_amendment_link(sample_amendment)
        assert link.startswith("https://custom.lake.example.com/")
        assert "DOC-ABC-123" in link

    def test_build_amendment_link_url_encodes_special_characters(self):
        study = StudyInfo(
            study_id="STUDY 001/A",
            study_name="Test Study",
            protocol_number="P-001",
            sponsor="Sponsor",
        )
        document = AmendmentDocument(
            document_id="DOC 123&456",
            storage_path="/path",
            file_name="amendment v2 (final).pdf",
        )
        amendment = ProtocolAmendment(
            amendment_id="AMD-SPECIAL",
            study=study,
            version_number="1.0",
            summary_of_changes="Test changes",
            amendment_type=AmendmentType.ADMINISTRATIVE,
            document=document,
            published_at=datetime.now(timezone.utc),
        )
        builder = DocumentLinkBuilder()
        link = builder.build_amendment_link(amendment)
        # Special characters should be URL-encoded
        assert "STUDY%20001%2FA" in link
        assert "DOC%20123%26456" in link
        assert "amendment%20v2%20%28final%29.pdf" in link

    def test_base_url_trailing_slash_handled(self, sample_amendment):
        builder = DocumentLinkBuilder(
            base_url="https://datalake.studyconnect.internal/"
        )
        link = builder.build_amendment_link(sample_amendment)
        assert "//" not in link.replace("https://", "")

    def test_base_url_property(self):
        builder = DocumentLinkBuilder(base_url="https://example.com/")
        assert builder.base_url == "https://example.com"

    def test_default_base_url(self):
        builder = DocumentLinkBuilder()
        assert builder.base_url == "https://datalake.studyconnect.internal"
