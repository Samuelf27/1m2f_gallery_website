import os
from flask import Blueprint, jsonify, request, abort
from app.models.artwork import Artwork
from app.models.artist import Artist
from extensions import db

artworks_bp = Blueprint("artworks", __name__)

_MUTABLE_FIELDS = [
    "title", "year", "description", "image_url",
    "category", "dimensions", "available", "featured",
]


def require_api_key():
    auth = request.headers.get("Authorization", "")
    expected = f"Bearer {os.environ.get('API_SECRET_KEY', '')}"
    if not auth or auth != expected:
        abort(401)


def get_or_create_artist(name: str) -> Artist:
    """Return existing artist or create one. Normalises name to title-case."""
    normalised = name.strip().title()
    artist = Artist.query.filter_by(name=normalised).first()
    if not artist:
        artist = Artist(name=normalised)
        db.session.add(artist)
        db.session.flush()
    return artist


@artworks_bp.route("/", methods=["GET"])
def list_artworks():
    page     = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 50, type=int), 100)
    category = request.args.get("category")
    featured = request.args.get("featured")
    available = request.args.get("available")

    query = Artwork.query

    if category:
        query = query.filter(Artwork.category == category)
    if featured is not None:
        query = query.filter(Artwork.featured == (featured.lower() == "true"))
    if available:
        query = query.filter(Artwork.available == available)

    query = query.order_by(Artwork.created_at.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "items":   [art.to_dict() for art in pagination.items],
        "total":   pagination.total,
        "page":    pagination.page,
        "pages":   pagination.pages,
        "per_page": pagination.per_page,
    })


@artworks_bp.route("/<int:id>", methods=["GET"])
def get_artwork(id):
    art = db.get_or_404(Artwork, id)
    return jsonify(art.to_dict())


@artworks_bp.route("/", methods=["POST"])
def create_artwork():
    require_api_key()
    data = request.get_json(silent=True)

    if not data or not data.get("title", "").strip():
        return jsonify({"error": "O campo 'title' é obrigatório"}), 400

    artist_id = None
    if data.get("artist"):
        artist_id = get_or_create_artist(data["artist"]).id

    art = Artwork(
        title=data["title"].strip(),
        artist_id=artist_id,
        year=data.get("year"),
        description=data.get("description"),
        image_url=data.get("image_url"),
        category=data.get("category"),
        dimensions=data.get("dimensions"),
        available=data.get("available", "disponível"),
        featured=bool(data.get("featured", False)),
    )
    db.session.add(art)
    db.session.commit()
    return jsonify(art.to_dict()), 201


@artworks_bp.route("/<int:id>", methods=["PUT"])
def update_artwork(id):
    require_api_key()
    art = db.get_or_404(Artwork, id)
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Nenhum dado enviado"}), 400

    if "artist" in data:
        art.artist_id = get_or_create_artist(data["artist"]).id if data["artist"] else None

    for field in _MUTABLE_FIELDS:
        if field in data:
            setattr(art, field, data[field])

    db.session.commit()
    return jsonify(art.to_dict())


@artworks_bp.route("/<int:id>", methods=["DELETE"])
def delete_artwork(id):
    require_api_key()
    art = db.get_or_404(Artwork, id)
    db.session.delete(art)
    db.session.commit()
    return "", 204