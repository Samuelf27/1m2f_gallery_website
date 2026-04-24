from datetime import datetime, timezone
from extensions import db


class AuditLog(db.Model):
    __tablename__ = "audit_logs"

    id           = db.Column(db.Integer, primary_key=True)
    entity_type  = db.Column(db.String(50), nullable=False)
    entity_id    = db.Column(db.Integer, nullable=True)
    entity_title = db.Column(db.String(300), nullable=True)
    action       = db.Column(db.String(20), nullable=False)  # criou / atualizou / deletou
    created_at   = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def to_dict(self):
        return {
            "id":           self.id,
            "entity_type":  self.entity_type,
            "entity_id":    self.entity_id,
            "entity_title": self.entity_title,
            "action":       self.action,
            "created_at":   self.created_at.isoformat() if self.created_at else None,
        }
