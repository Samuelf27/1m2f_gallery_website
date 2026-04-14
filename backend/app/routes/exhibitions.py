import os
from flask import Blueprint, jsonify, request, abort
from app.models.exhibition import Exhibition
from extensions import db

exhibitions_bp = Blueprint("exhibitions", __name__)


def require_api_key():
    auth = request.headers.get("Authorization", "")
    expected = f"Bearer {os.environ.get('API_SECRET_KEY', '')}"
    if not auth or auth != expected:
        abort(401)


@exhibitions_bp.route("/", methods=["GET"])
def list_exhibitions():
    exhibitions = Exhibition.query.order_by(Exhibition.start_date.desc()).all()
    return jsonify([e.to_dict() for e in exhibitions])


@exhibitions_bp.route("/<int:id>", methods=["GET"])
def get_exhibition(id):
    exhibition = db.get_or_404(Exhibition, id)
    return jsonify(exhibition.to_dict())


@exhibitions_bp.route("/", methods=["POST"])
def create_exhibition():
    require_api_key()
    data = request.get_json()

    if not data or not data.get("title"):
        abort(400)

    exhibition = Exhibition(
        title=data["title"],
        subtitle=data.get("subtitle"),
        start_date=data.get("start_date"),
        end_date=data.get("end_date"),
        location=data.get("location"),
        description=data.get("description"),
    )
    db.session.add(exhibition)
    db.session.commit()
    return jsonify(exhibition.to_dict()), 201


@exhibitions_bp.route("/<int:id>", methods=["PUT"])
def update_exhibition(id):
    require_api_key()
    exhibition = db.get_or_404(Exhibition, id)
    data = request.get_json()

    for field in ["title", "subtitle", "start_date", "end_date", "location", "description"]:
        if field in data:
            setattr(exhibition, field, data[field])

    db.session.commit()
    return jsonify(exhibition.to_dict())


@exhibitions_bp.route("/<int:id>", methods=["DELETE"])
def delete_exhibition(id):
    require_api_key()
    exhibition = db.get_or_404(Exhibition, id)
    db.session.delete(exhibition)
    db.session.commit()
    return "", 204