import os
from dotenv import load_dotenv
load_dotenv()  # carrega .env antes de qualquer acesso a os.environ

from flask import Flask
from flask_cors import CORS
from extensions import db, migrate

# Import all models so SQLAlchemy metadata is populated before db.create_all()
import app.models  # noqa: F401


def create_app() -> Flask:
    app = Flask(__name__)

    # ── Config ────────────────────────────────────────────────
    secret = os.environ.get("SECRET_KEY")
    if not secret:
        raise RuntimeError("SECRET_KEY env var is not set")

    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL", "sqlite:///gallery.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = secret

    # ── Extensions ────────────────────────────────────────────
    allowed_origins = os.environ.get(
        "ALLOWED_ORIGINS",
        "http://localhost:3000"
    ).split(",")
    CORS(app, origins=allowed_origins)
    db.init_app(app)
    migrate.init_app(app, db)

    # ── Swagger (dev only) ────────────────────────────────────
    if os.environ.get("FLASK_ENV") == "development":
        from flasgger import Swagger
        Swagger(app)

    # ── Blueprints ────────────────────────────────────────────
    from app.routes.artworks import artworks_bp
    from app.routes.exhibitions import exhibitions_bp
    from app.routes.testimonials import testimonials_bp

    app.register_blueprint(artworks_bp,   url_prefix="/api/artworks")
    app.register_blueprint(exhibitions_bp, url_prefix="/api/exhibitions")
    app.register_blueprint(testimonials_bp, url_prefix="/api/testimonials")

    # ── Health check ──────────────────────────────────────────
    @app.route("/")
    def health():
        return {"status": "ok", "service": "1M2F Gallery API"}

    return app


app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_ENV") == "development")