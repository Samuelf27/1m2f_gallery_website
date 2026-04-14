import os
from flask import Blueprint, jsonify, request, abort
from app.models.exhibition import Exhibition
from extensions import db

exhibitions_bp = Blueprint("exhibitions", __name__)

_MUTABLE_FIELDS = ["title", "subtitle", "start_date", "end_date", "location", "description"]


def require_api_key():
    auth = request.headers.get("Authorization", "")
    expected = f"Bearer {os.environ.get('API_SECRET_KEY', '')}"
    if not auth or auth != expected:
        abort(401)


@exhibitions_bp.route("/", methods=["GET"])
def list_exhibitions():
    status = request.args.get("status")
    query = Exhibition.query.order_by(Exhibition.start_date.desc())
    exhibitions = query.all()

    items = [e for e in exhibitions if (e.get_status() == status if status else True)]
    return jsonify([e.to_dict() for e in items])


@exhibitions_bp.route("/<int:id>", methods=["GET"])
def get_exhibition(id):
    exhibition = db.get_or_404(Exhibition, id)
    return jsonify(exhibition.to_dict())


@exhibitions_bp.route("/", methods=["POST"])
def create_exhibition():
    require_api_key()
    data = request.get_json(silent=True)

    if not data or not data.get("title", "").strip():
        return jsonify({"error": "O campo 'title' é obrigatório"}), 400

    exhibition = Exhibition(
        title=data["title"].strip(),
        subtitle=data.get("subtitle"),
        start_date=data.get("start_date") or None,
        end_date=data.get("end_date") or None,
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
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Nenhum dado enviado"}), 400

    for field in _MUTABLE_FIELDS:
        if field in data:
            value = data[field]
            # Treat empty strings as NULL for date fields
            if field in ("start_date", "end_date") and value == "":
                value = None
            setattr(exhibition, field, value)

    db.session.commit()
    return jsonify(exhibition.to_dict())


@exhibitions_bp.route("/<int:id>", methods=["DELETE"])
def delete_exhibition(id):
    require_api_key()
    exhibition = db.get_or_404(Exhibition, id)
    db.session.delete(exhibition)
    db.session.commit()
    return "", 204