import json

import structlog

from app.core.logging import setup_logging


def test_setup_logging_initialization() -> None:
    """Verify logging configuration executes without errors."""
    setup_logging()
    assert structlog.is_configured()


def test_structlog_json_output(capsys) -> None:
    """Verify that logging messages are emitted in structured JSON format."""
    setup_logging()
    logger = structlog.get_logger("test_logger")
    logger.info("observability_test_message", custom_field="saudi-heritage")

    captured = capsys.readouterr()
    lines = [line for line in captured.out.split("\n") if line.strip()]
    assert len(lines) >= 1

    # Find the JSON log line
    json_line = None
    for line in reversed(lines):
        try:
            data = json.loads(line)
            if data.get("event") == "observability_test_message":
                json_line = data
                break
        except json.JSONDecodeError:
            continue

    assert json_line is not None
    assert json_line["level"] == "info"
    assert json_line["custom_field"] == "saudi-heritage"
    assert "timestamp" in json_line
