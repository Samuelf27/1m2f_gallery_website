import os
from flask import Blueprint, jsonify, request, abort
from app.models.testimonial import Testimonial
from extensions import db

testimonials_bp = Blueprint("testimonials", __name__)


def require_api_key():
    auth = request.headers.get("Authorization", "")
    expected = f"Bearer {os.environ.get('API_SECRET_KEY', '')}"
    if not auth or auth != expected:
        abort(401)


@testimonials_bp.route("/", methods=["GET"])
def list_testimonials():
    testimonials = Testimonial.query.all()
    return jsonify([t.to_dict() for t in testimonials])


@testimonials_bp.route("/<int:id>", methods=["GET"])
def get_testimonial(id):
    testimonial = db.get_or_404(Testimonial, id)
    return jsonify(testimonial.to_dict())


@testimonials_bp.route("/", methods=["POST"])
def create_testimonial():
    require_api_key()
    data = request.get_json()

    if not data or not data.get("name") or not data.get("text"):
        abort(400)

    testimonial = Testimonial(
        name=data["name"],
        text=data["text"],
        city=data.get("city"),
        role=data.get("role"),
        visible=data.get("visible", True),
    )
    db.session.add(testimonial)
    db.session.commit()
    return jsonify(testimonial.to_dict()), 201


@testimonials_bp.route("/<int:id>", methods=["PUT"])
def update_testimonial(id):
    require_api_key()
    testimonial = db.get_or_404(Testimonial, id)
    data = request.get_json()

    for field in ["name", "text", "city", "role", "visible"]:
        if field in data:
            setattr(testimonial, field, data[field])

    db.session.commit()
    return jsonify(testimonial.to_dict())


@testimonials_bp.route("/<int:id>", methods=["DELETE"])
def delete_testimonial(id):
    require_api_key()
    testimonial = db.get_or_404(Testimonial, id)
    db.session.delete(testimonial)
    db.session.commit()
    return "", 204