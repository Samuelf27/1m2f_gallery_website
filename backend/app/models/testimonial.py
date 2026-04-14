from extensions import db


class Testimonial(db.Model):
    __tablename__ = "testimonials"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    text = db.Column(db.Text, nullable=False)
    city = db.Column(db.String(200))
    role = db.Column(db.String(200))
    visible = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "text": self.text,
            "city": self.city,
            "role": self.role,
            "visible": self.visible if self.visible is not None else True,
        }