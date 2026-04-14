from extensions import db
from datetime import date


class Exhibition(db.Model):
    __tablename__ = "exhibitions"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    subtitle = db.Column(db.String(300))
    start_date = db.Column(db.String(50))
    end_date = db.Column(db.String(50))
    location = db.Column(db.String(200))
    description = db.Column(db.Text)

    def get_status(self):
        today = date.today().isoformat()
        if not self.start_date or not self.end_date:
            return "indefinida"
        if today < self.start_date:
            return "proxima"
        elif today > self.end_date:
            return "encerrada"
        return "em_cartaz"

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "subtitle": self.subtitle,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "location": self.location,
            "description": self.description,
            "status": self.get_status(),
        }