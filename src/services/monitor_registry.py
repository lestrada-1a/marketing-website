"""Registry for looking up Medical Monitors assigned to studies.

In production this would query the StudyConnect database or a dedicated
assignment service.  The implementation here defines a clean interface
that can be backed by any data source.
"""

from __future__ import annotations

from typing import Protocol, Sequence

from src.models.amendment import MedicalMonitor


class MonitorRegistryProtocol(Protocol):
    """Interface for resolving Medical Monitors assigned to a study."""

    def get_monitors_for_study(self, study_id: str) -> Sequence[MedicalMonitor]:
        """Return all Medical Monitors assigned to the given study.

        Args:
            study_id: The unique identifier of the clinical study.

        Returns:
            A sequence of MedicalMonitor objects.  May be empty if no
            monitors are currently assigned.
        """
        ...  # pragma: no cover


class InMemoryMonitorRegistry:
    """Simple in-memory registry, useful for testing and local development."""

    def __init__(self) -> None:
        self._assignments: dict[str, list[MedicalMonitor]] = {}

    def assign_monitor(self, study_id: str, monitor: MedicalMonitor) -> None:
        """Assign a Medical Monitor to a study.

        Args:
            study_id: The study to assign the monitor to.
            monitor: The Medical Monitor to assign.
        """
        self._assignments.setdefault(study_id, [])
        # Avoid duplicate assignments
        existing_ids = {m.monitor_id for m in self._assignments[study_id]}
        if monitor.monitor_id not in existing_ids:
            self._assignments[study_id].append(monitor)

    def get_monitors_for_study(self, study_id: str) -> Sequence[MedicalMonitor]:
        """Return all Medical Monitors assigned to the given study.

        Args:
            study_id: The unique identifier of the clinical study.

        Returns:
            A sequence of MedicalMonitor objects.
        """
        return list(self._assignments.get(study_id, []))
