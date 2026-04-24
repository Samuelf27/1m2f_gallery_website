"""Thin helper — call log_action() inside any route before db.session.commit()."""
from app.models.audit_log import AuditLog
from extensions import db


def log_action(entity_type: str, action: str, entity_id=None, entity_title=None):
    try:
        db.session.add(AuditLog(
            entity_type=entity_type,
            action=action,
            entity_id=entity_id,
            entity_title=entity_title,
        ))
    except Exception:
        pass  # never let audit logging break a request
