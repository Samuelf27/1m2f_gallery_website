from flask import Blueprint, jsonify
from app.models.artwork import Artwork
from extensions import db

artworks_bp = Blueprint("artworks", __name__)


@artworks_bp.route("/", methods=["GET"])
def list_artworks():
    artworks = Artwork.query.all()
    return jsonify([art.to_dict() for art in artworks])


@artworks_bp.route("/<int:id>", methods=["GET"])
def get_artwork(id):
    art = db.get_or_404(Artwork, id)
    return jsonify(art.to_dict())