"""Tests for the MonitorRegistry."""

import pytest

from src.models.amendment import MedicalMonitor, NotificationChannel
from src.services.monitor_registry import InMemoryMonitorRegistry


class TestInMemoryMonitorRegistry:
    """Tests for the in-memory monitor registry."""

    def test_get_monitors_for_study_returns_assigned_monitors(
        self, monitor_registry, sample_monitors
    ):
        monitors = monitor_registry.get_monitors_for_study("STUDY-001")
        assert len(monitors) == 3
        monitor_ids = {m.monitor_id for m in monitors}
        assert monitor_ids == {"MON-001", "MON-002", "MON-003"}

    def test_get_monitors_for_unassigned_study_returns_empty(self, monitor_registry):
        monitors = monitor_registry.get_monitors_for_study("STUDY-UNKNOWN")
        assert len(monitors) == 0

    def test_assign_monitor_prevents_duplicates(self):
        registry = InMemoryMonitorRegistry()
        monitor = MedicalMonitor(
            monitor_id="MON-DUP",
            name="Dr. Duplicate",
            email="dup@example.com",
        )
        registry.assign_monitor("STUDY-X", monitor)
        registry.assign_monitor("STUDY-X", monitor)  # duplicate
        monitors = registry.get_monitors_for_study("STUDY-X")
        assert len(monitors) == 1

    def test_monitors_can_be_assigned_to_multiple_studies(self):
        registry = InMemoryMonitorRegistry()
        monitor = MedicalMonitor(
            monitor_id="MON-MULTI",
            name="Dr. Multi",
            email="multi@example.com",
        )
        registry.assign_monitor("STUDY-A", monitor)
        registry.assign_monitor("STUDY-B", monitor)

        assert len(registry.get_monitors_for_study("STUDY-A")) == 1
        assert len(registry.get_monitors_for_study("STUDY-B")) == 1

    def test_different_monitors_for_same_study(self):
        registry = InMemoryMonitorRegistry()
        m1 = MedicalMonitor(
            monitor_id="MON-A", name="Dr. A", email="a@example.com"
        )
        m2 = MedicalMonitor(
            monitor_id="MON-B", name="Dr. B", email="b@example.com"
        )
        registry.assign_monitor("STUDY-X", m1)
        registry.assign_monitor("STUDY-X", m2)
        monitors = registry.get_monitors_for_study("STUDY-X")
        assert len(monitors) == 2
