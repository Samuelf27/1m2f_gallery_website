import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_cors import CORS
from extensions import db, migrate
import app.models  # noqa: F401 — registers all models with SQLAlchemy


def create_app() -> Flask:
    flask_app = Flask(__name__)

    # ── Config ────────────────────────────────────────────────
    secret = os.environ.get("SECRET_KEY")
    if not secret:
        raise RuntimeError("SECRET_KEY env var is not set")

    db_url = os.environ.get("DATABASE_URL", "sqlite:///gallery.db")
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    flask_app.config["SQLALCHEMY_DATABASE_URI"]     = db_url
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    flask_app.config["SECRET_KEY"]                  = secret

    # ── Extensions ────────────────────────────────────────────
    allowed_origins = [
        o.strip()
        for o in os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
        if o.strip()
    ]
    CORS(flask_app, origins=allowed_origins, supports_credentials=False)
    db.init_app(flask_app)
    migrate.init_app(flask_app, db)

    # ── DB bootstrap ─────────────────────────────────────────
    with flask_app.app_context():
        if "sqlite" in flask_app.config["SQLALCHEMY_DATABASE_URI"]:
            db.drop_all()
        db.create_all()

    # ── Blueprints ────────────────────────────────────────────
    from app.routes.artworks    import artworks_bp
    from app.routes.exhibitions import exhibitions_bp
    from app.routes.testimonials import testimonials_bp
    from app.routes.settings    import settings_bp

    flask_app.register_blueprint(artworks_bp,    url_prefix="/api/artworks")
    flask_app.register_blueprint(exhibitions_bp,  url_prefix="/api/exhibitions")
    flask_app.register_blueprint(testimonials_bp, url_prefix="/api/testimonials")
    flask_app.register_blueprint(settings_bp,     url_prefix="/api/settings")

    # ── Health check ──────────────────────────────────────────
    @flask_app.route("/")
    def health():
        return {"status": "ok", "service": "1M2F Gallery API"}

    return flask_app


app = create_app()
