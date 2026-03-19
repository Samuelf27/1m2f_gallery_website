from app.extensions import db

class Artwork(db.Model):
    __tablename__ = "artworks"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    artist_id = db.Column(db.Integer, db.ForeignKey("artist.id"))
    year = db.Column(db.String(50))
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    category = db.Column(db.String(100))

    artist = db.relationship("Artist", backref="artworks")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "artist": self.artist.name if self.artist else None,
            "year": self.year,
            "description": self.description,
            "image_url": self.image_url,
            "category": self.category
        }