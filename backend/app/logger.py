import json
import logging
import os
from datetime import datetime, timezone


class _JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        entry: dict = {
            "ts":      datetime.now(timezone.utc).isoformat(),
            "level":   record.levelname,
            "logger":  record.name,
            "msg":     record.getMessage(),
        }
        if record.exc_info:
            entry["exc"] = self.formatException(record.exc_info)
        return json.dumps(entry, ensure_ascii=False)


def configure_logging() -> None:
    level = logging.DEBUG if os.environ.get("FLASK_DEBUG") == "1" else logging.INFO
    handler = logging.StreamHandler()
    handler.setFormatter(_JSONFormatter())
    root = logging.getLogger()
    root.setLevel(level)
    root.handlers = [handler]
    # Silence noisy third-party loggers in production
    if level != logging.DEBUG:
        logging.getLogger("werkzeug").setLevel(logging.WARNING)