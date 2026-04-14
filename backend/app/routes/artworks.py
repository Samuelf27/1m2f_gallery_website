import os
from flask import Blueprint, jsonify, request, abort
from app.models.artwork import Artwork
from app.models.artist import Artist
from extensions import db

artworks_bp = Blueprint("artworks", __name__)


def require_api_key():
    auth = request.headers.get("Authorization", "")
    expected = f"Bearer {os.environ.get('API_SECRET_KEY', '')}"
    if not auth or auth != expected:
        abort(401)


def get_or_create_artist(name: str):
    artist = Artist.query.filter_by(name=name).first()
    if not artist:
        artist = Artist(name=name)
        db.session.add(artist)
        db.session.flush()
    return artist


@artworks_bp.route("/", methods=["GET"])
def list_artworks():
    artworks = Artwork.query.all()
    return jsonify([art.to_dict() for art in artworks])


@artworks_bp.route("/<int:id>", methods=["GET"])
def get_artwork(id):
    art = db.get_or_404(Artwork, id)
    return jsonify(art.to_dict())


@artworks_bp.route("/", methods=["POST"])
def create_artwork():
    require_api_key()
    data = request.get_json()

    if not data or not data.get("title"):
        abort(400)

    artist_id = None
    if data.get("artist"):
        artist_id = get_or_create_artist(data["artist"]).id

    art = Artwork(
        title=data["title"],
        artist_id=artist_id,
        year=data.get("year"),
        description=data.get("description"),
        image_url=data.get("image_url"),
        category=data.get("category"),
        dimensions=data.get("dimensions"),
        available=data.get("available", "disponível"),
        featured=data.get("featured", False),
    )
    db.session.add(art)
    db.session.commit()
    return jsonify(art.to_dict()), 201


@artworks_bp.route("/<int:id>", methods=["PUT"])
def update_artwork(id):
    require_api_key()
    art = db.get_or_404(Artwork, id)
    data = request.get_json()

    if "artist" in data:
        if data["artist"]:
            art.artist_id = get_or_create_artist(data["artist"]).id
        else:
            art.artist_id = None

    for field in ["title", "year", "description", "image_url", "category", "dimensions", "available", "featured"]:
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