"""Builds deep links to amendment documents in the study data lake.

The study data lake stores amendment documents in a hierarchical structure:
    /{sponsor}/{study_id}/amendments/{document_id}/{file_name}

This service constructs fully-qualified URLs that allow Medical Monitors
to navigate directly to the amendment document for review.
"""

from __future__ import annotations

from urllib.parse import quote, urljoin

from src.models.amendment import AmendmentDocument, ProtocolAmendment


class DocumentLinkBuilder:
    """Constructs deep links to documents in the study data lake."""

    DEFAULT_BASE_URL = "https://datalake.studyconnect.internal"
    DOCUMENT_PATH_TEMPLATE = "/studies/{study_id}/amendments/{document_id}/{file_name}"

    def __init__(self, base_url: str | None = None) -> None:
        """Initialise with the data lake base URL.

        Args:
            base_url: Root URL of the study data lake.  Falls back to
                      the default internal URL when not provided.
        """
        self._base_url = (base_url or self.DEFAULT_BASE_URL).rstrip("/")

    @property
    def base_url(self) -> str:
        return self._base_url

    def build_amendment_link(self, amendment: ProtocolAmendment) -> str:
        """Build a deep link URL to the amendment document.

        The generated link points directly to the amendment document in the
        study data lake, allowing Medical Monitors to open it with one click.

        Args:
            amendment: The protocol amendment containing document metadata.

        Returns:
            A fully-qualified URL to the amendment document.

        Raises:
            ValueError: If the amendment has no associated document.
        """
        if amendment.document is None:
            raise ValueError(
                f"Amendment {amendment.amendment_id} has no associated document"
            )

        return self._build_document_url(
            study_id=amendment.study.study_id,
            document=amendment.document,
        )

    def _build_document_url(
        self, study_id: str, document: AmendmentDocument
    ) -> str:
        """Construct the full URL for a document in the data lake.

        Args:
            study_id: The study identifier.
            document: The amendment document metadata.

        Returns:
            The fully-qualified document URL.
        """
        path = self.DOCUMENT_PATH_TEMPLATE.format(
            study_id=quote(study_id, safe=""),
            document_id=quote(document.document_id, safe=""),
            file_name=quote(document.file_name, safe=""),
        )
        return urljoin(self._base_url + "/", path.lstrip("/"))
