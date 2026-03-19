from app.extensions import db

class Artist(db.Model):
    __tablename__ = "artist"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    bio = db.Column(db.Text)
    photo = db.Column(db.String(255))