from datetime import date, datetime, timezone
from extensions import db


class Exhibition(db.Model):
    __tablename__ = "exhibitions"

    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(200), nullable=False)
    subtitle    = db.Column(db.String(300))
    start_date  = db.Column(db.String(50))
    end_date    = db.Column(db.String(50))
    location    = db.Column(db.String(200))
    description = db.Column(db.Text)
    created_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at  = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def get_status(self) -> str:
        today = date.today().isoformat()
        if not self.start_date or not self.end_date:
            return "indefinida"
        if today < self.start_date:
            return "proxima"
        if today > self.end_date:
            return "encerrada"
        return "em_cartaz"

    def to_dict(self):
        return {
            "id":          self.id,
            "title":       self.title,
            "subtitle":    self.subtitle,
            "start_date":  self.start_date,
            "end_date":    self.end_date,
            "location":    self.location,
            "description": self.description,
            "status":      self.get_status(),
            "created_at":  self.created_at.isoformat() if self.created_at else None,
            "updated_at":  self.updated_at.isoformat() if self.updated_at else None,
        }