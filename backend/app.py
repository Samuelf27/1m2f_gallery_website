from flask import Flask, request, jsonify
from flasgger import Swagger
from flask_cors import CORS

from extensions import db
from app.routes.artworks import artworks_bp
from app.models.artist import Artist
from app.models.artwork import Artwork
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

    # Busca ou cria o artista pelo nome
    artist_name = data.get("artist")
    artist = None
    if artist_name:
        artist = Artist.query.filter_by(name=artist_name).first()
        if not artist:
            artist = Artist(name=artist_name)
            db.session.add(artist)
            db.session.flush()  # gera o ID sem commitar ainda

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

    # Atualiza os campos enviados (ignora os que não vieram)
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

    # Atualiza artista pelo nome, se enviado
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


# SEED
def seed_database():
    if Artwork.query.count() == 0:
        artist1 = Artist(name="Leonardo da Vinci")
        artist2 = Artist(name="Vincent van Gogh")
        db.session.add_all([artist1, artist2])
        db.session.commit()

        art1 = Artwork(
            title="Mona Lisa",
            artist_id=artist1.id,
            year="1503",
            description="Portrait painting by Leonardo da Vinci",
            image_url="https://upload.wikimedia.org/wikipedia/commons/6/6a/Mona_Lisa.jpg",
            category="Renaissance",
        )
        art2 = Artwork(
            title="Starry Night",
            artist_id=artist2.id,
            year="1889",
            description="Famous painting by Van Gogh",
            image_url="https://upload.wikimedia.org/wikipedia/commons/e/ea/The_Starry_Night.JPG",
            category="Post-Impressionism",
        )
        db.session.add_all([art1, art2])
        db.session.commit()
        print("🎨 Banco populado com sucesso!")


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        seed_database()

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)