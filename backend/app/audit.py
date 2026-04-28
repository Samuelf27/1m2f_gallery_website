"""Thin helper — call log_action() inside any route before db.session.commit()."""
import logging
from app.models.audit_log import AuditLog
from extensions import db

logger = logging.getLogger(__name__)


def log_action(entity_type: str, action: str, entity_id=None, entity_title=None):
    try:
        db.session.add(AuditLog(
            entity_type=entity_type,
            action=action,
            entity_id=entity_id,
            entity_title=entity_title,
        ))
    except Exception as exc:
        logger.warning("audit log failed: %s", exc)
