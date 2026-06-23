# Protocol Amendment Notification Service

**Jira:** [DSE-4](https://one-atlas-dmye.atlassian.net/browse/DSE-4) — Part of [DSE-1: Real-time Study Milestone Notifications](https://one-atlas-dmye.atlassian.net/browse/DSE-1)

A microservice component for the **StudyConnect** platform that delivers real-time notifications to Medical Monitors when protocol amendments are published.

## User Story

> As a Medical Monitor, I want to be notified immediately when a protocol amendment is issued for any study I oversee, with a direct link to the amendment document, so I can review changes and assess impact on ongoing patient treatments.

## Acceptance Criteria

| # | Criterion | Implementation |
|---|-----------|---------------|
| AC1 | Notification fires within 2 minutes of amendment publication | Event-driven consumer triggers immediately on `protocol_amendment_published` events |
| AC2 | Includes amendment version number and summary of changes | Notification subject and body template includes version, type, and full summary |
| AC3 | Deep link to amendment document in the study data lake | `DocumentLinkBuilder` generates fully-qualified URLs to the data lake |
| AC4 | Notification sent to all assigned Medical Monitors for that study | `MonitorRegistry` resolves all monitors; notifications fan out per preferred channel |

## Architecture

```
┌─────────────────────┐     ┌──────────────────────────┐     ┌─────────────────────┐
│  Message Broker     │────▶│  AmendmentEventConsumer   │────▶│  AmendmentNotif.    │
│  (Kafka / SQS)      │     │  (deserialize & validate) │     │  Service            │
└─────────────────────┘     └──────────────────────────┘     │  (orchestrator)     │
                                                              └────────┬────────────┘
                                                                       │
                                              ┌────────────────────────┼─────────────────┐
                                              │                        │                 │
                                    ┌─────────▼──────┐   ┌────────────▼───┐  ┌──────────▼────────┐
                                    │ MonitorRegistry │   │ DocumentLink   │  │ Notification      │
                                    │ (lookup monitors│   │ Builder        │  │ Dispatcher        │
                                    │  for study)     │   │ (deep links)   │  │ (email/Teams/app) │
                                    └────────────────┘   └────────────────┘  └───────────────────┘
```

## Project Structure

```
src/
├── config.py                              # Service configuration
├── models/
│   └── amendment.py                       # Domain models (ProtocolAmendment, Notification, etc.)
└── services/
    ├── amendment_event_consumer.py         # Event consumer / message handler
    ├── amendment_notification_service.py   # Core orchestrator
    ├── document_link_builder.py           # Data lake deep link generator
    ├── monitor_registry.py                # Medical Monitor lookup
    └── notification_dispatcher.py         # Multi-channel notification dispatch

tests/
├── conftest.py                            # Shared fixtures
├── test_amendment_event_consumer.py
├── test_amendment_notification_service.py
├── test_document_link_builder.py
├── test_models.py
├── test_monitor_registry.py
└── test_notification_dispatcher.py
```

## Running Tests

```bash
pip install -r requirements.txt
python -m pytest tests/ -v
```

## Event Schema

The service consumes `protocol_amendment_published` events with this structure:

```json
{
  "event_id": "EVT-12345",
  "event_type": "protocol_amendment_published",
  "timestamp": "2026-06-23T10:00:00+00:00",
  "payload": {
    "amendment_id": "AMD-001",
    "version_number": "2.0",
    "summary_of_changes": "Updated inclusion criteria...",
    "amendment_type": "substantial",
    "study": {
      "study_id": "STUDY-001",
      "study_name": "BEACON Phase III",
      "protocol_number": "PROT-2026-001",
      "sponsor": "Acme Pharma"
    },
    "document": {
      "document_id": "DOC-ABC-123",
      "storage_path": "/path/to/document",
      "file_name": "amendment_v2.0.pdf"
    }
  }
}
```
