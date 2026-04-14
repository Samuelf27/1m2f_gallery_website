from flask import Flask, request, jsonify
from flasgger import Swagger
from flask_cors import CORS

from extensions import db
from app.routes.artworks import artworks_bp
from app.routes.exhibitions import exhibitions_bp
from app.routes.testimonials import testimonials_bp
from app.models.artist import Artist
from app.models.artwork import Artwork
from app.models.exhibition import Exhibition
from app.models.testimonial import Testimonial
import os

app = Flask(__name__)

# CORS
CORS(app)

# CONFIG
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///gallery.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev")

# EXTENSÕES
Swagger(app)
db.init_app(app)

# ROTAS (blueprint)
app.register_blueprint(artworks_bp, url_prefix="/api/artworks")
app.register_blueprint(exhibitions_bp, url_prefix="/api/exhibitions")
app.register_blueprint(testimonials_bp, url_prefix="/api/testimonials")


# ROTA HOME
@app.route("/")
def home():
    return {"message": "API da galeria funcionando 🚀"}


# POST — criar nova obra
@app.route("/api/artworks", methods=["POST"])
def create_artwork():
    data = request.get_json()

    if not data or not data.get("title"):
        return jsonify({"error": "O campo 'title' é obrigatório"}), 400

    artist_name = data.get("artist")
    artist = None
    if artist_name:
        artist = Artist.query.filter_by(name=artist_name).first()
        if not artist:
            artist = Artist(name=artist_name)
            db.session.add(artist)
            db.session.flush()

    artwork = Artwork(
        title=data.get("title"),
        artist_id=artist.id if artist else None,
        year=data.get("year"),
        description=data.get("description"),
        image_url=data.get("image_url"),
        category=data.get("category"),
    )

    db.session.add(artwork)
    db.session.commit()

    return jsonify(artwork.to_dict()), 201


# PUT — editar uma obra existente
@app.route("/api/artworks/<int:id>", methods=["PUT"])
def update_artwork(id):
    artwork = db.get_or_404(Artwork, id)
    data = request.get_json()

    if not data:
        return jsonify({"error": "Nenhum dado enviado"}), 400

    if "title" in data:
        artwork.title = data["title"]
    if "year" in data:
        artwork.year = data["year"]
    if "description" in data:
        artwork.description = data["description"]
    if "image_url" in data:
        artwork.image_url = data["image_url"]
    if "category" in data:
        artwork.category = data["category"]

    if "artist" in data:
        artist = Artist.query.filter_by(name=data["artist"]).first()
        if not artist:
            artist = Artist(name=data["artist"])
            db.session.add(artist)
            db.session.flush()
        artwork.artist_id = artist.id

    db.session.commit()

    return jsonify(artwork.to_dict()), 200


# DELETE — remover uma obra
@app.route("/api/artworks/<int:id>", methods=["DELETE"])
def delete_artwork(id):
    artwork = db.get_or_404(Artwork, id)

    db.session.delete(artwork)
    db.session.commit()

    return jsonify({"message": f"Obra '{artwork.title}' removida com sucesso"}), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)