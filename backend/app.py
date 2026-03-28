from flask import Flask
from flasgger import Swagger
from flask_cors import CORS

from backend.extensions import db
from app.routes.artworks import artworks_bp
from app.models.artist import Artist
from app.models.artwork import Artwork
import os

app = Flask(__name__)

# 🔥 CORS
CORS(app)

# CONFIG
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///gallery.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# EXTENSÕES
Swagger(app)
db.init_app(app)

# ROTAS
app.register_blueprint(artworks_bp, url_prefix="/api/artworks")


# ROTA HOME
@app.route("/")
def home():
    return {"message": "API da galeria funcionando 🚀"}


# SEED (corrigido com Artist)
def seed_database():
    if Artwork.query.count() == 0:

        # cria artistas
        artist1 = Artist(name="Leonardo da Vinci")
        artist2 = Artist(name="Vincent van Gogh")

        db.session.add_all([artist1, artist2])
        db.session.commit()

        # cria obras usando artist_id
        art1 = Artwork(
            title="Mona Lisa",
            artist_id=artist1.id,
            year="1503",
            description="Portrait painting by Leonardo da Vinci",
            image_url="https://upload.wikimedia.org/wikipedia/commons/6/6a/Mona_Lisa.jpg",
            category="Renaissance"
        )

        art2 = Artwork(
            title="Starry Night",
            artist_id=artist2.id,
            year="1889",
            description="Famous painting by Van Gogh",
            image_url="https://upload.wikimedia.org/wikipedia/commons/e/ea/The_Starry_Night.JPG",
            category="Post-Impressionism"
        )

        db.session.add_all([art1, art2])
        db.session.commit()

        print("🎨 Banco populado com sucesso!")

# POST
@app.route("/api/artworks", methods=["POST"])

# PUT
@app.route("/api/artworks/<id>", methods=["PUT"])

# DELETE
@app.route("/api/artworks/<id>", methods=["DELETE"])

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        seed_database()

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)