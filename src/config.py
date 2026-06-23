"""Configuration for the protocol amendment notification service."""

from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class ServiceConfig:
    """Configuration for the amendment notification service."""

    # Data lake settings
    data_lake_base_url: str = "https://datalake.studyconnect.internal"

    # Message broker settings
    broker_topic: str = "studyconnect.protocol.amendments"

    # Notification SLA (seconds) — AC1 requires < 120s
    notification_sla_seconds: int = 120

    # Delivery target — epic requires 95% delivery rate
    delivery_rate_target: float = 0.95

    @classmethod
    def from_env(cls) -> ServiceConfig:
        """Load configuration from environment variables."""
        return cls(
            data_lake_base_url=os.getenv(
                "DATA_LAKE_BASE_URL",
                cls.data_lake_base_url,
            ),
            broker_topic=os.getenv(
                "BROKER_TOPIC",
                cls.broker_topic,
            ),
            notification_sla_seconds=int(
                os.getenv("NOTIFICATION_SLA_SECONDS", str(cls.notification_sla_seconds))
            ),
            delivery_rate_target=float(
                os.getenv(
                    "DELIVERY_RATE_TARGET",
                    str(cls.delivery_rate_target),
                )
            ),
        )
