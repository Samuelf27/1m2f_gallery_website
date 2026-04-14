from datetime import datetime, timezone
from extensions import db


class Artwork(db.Model):
    __tablename__ = "artworks"

    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(200), nullable=False)
    artist_id   = db.Column(db.Integer, db.ForeignKey("artists.id"))
    year        = db.Column(db.String(50))
    description = db.Column(db.Text)
    image_url   = db.Column(db.String(500))
    category    = db.Column(db.String(100))
    dimensions  = db.Column(db.String(100))
    available   = db.Column(db.String(50), default="disponível")
    featured    = db.Column(db.Boolean, default=False, nullable=False)
    created_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at  = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    artist = db.relationship("Artist", backref="artworks")

    def to_dict(self):
        return {
            "id":          self.id,
            "title":       self.title,
            "artist":      self.artist.name if self.artist else None,
            "year":        self.year,
            "description": self.description,
            "image_url":   self.image_url,
            "category":    self.category,
            "dimensions":  self.dimensions,
            "available":   self.available or "disponível",
            "featured":    bool(self.featured),
            "created_at":  self.created_at.isoformat() if self.created_at else None,
            "updated_at":  self.updated_at.isoformat() if self.updated_at else None,
        }