from datetime import datetime, timezone
from extensions import db


class Testimonial(db.Model):
    __tablename__ = "testimonials"

    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(200), nullable=False)
    text       = db.Column(db.Text, nullable=False)
    city       = db.Column(db.String(200))
    role       = db.Column(db.String(200))
    visible    = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def to_dict(self):
        return {
            "id":         self.id,
            "name":       self.name,
            "text":       self.text,
            "city":       self.city,
            "role":       self.role,
            "visible":    bool(self.visible),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }