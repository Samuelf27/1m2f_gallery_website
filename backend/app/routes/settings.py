import os
from flask import Blueprint, jsonify, request, abort
from app.models.setting import Setting
from extensions import db

settings_bp = Blueprint("settings", __name__)

ALLOWED_KEYS = {
    "whatsapp", "email", "address",
    "instagram", "facebook",
    "gallery_description",
}


def require_api_key():
    auth = request.headers.get("Authorization", "")
    expected = f"Bearer {os.environ.get('API_SECRET_KEY', '')}"
    if not auth or auth != expected:
        abort(401)


@settings_bp.route("/", methods=["GET"])
def get_settings():
    settings = Setting.query.all()
    return jsonify({s.key: s.value for s in settings})


@settings_bp.route("/", methods=["PUT"])
def update_settings():
    require_api_key()
    data = request.get_json(force=True) or {}

    for key, value in data.items():
        if key not in ALLOWED_KEYS:
            continue
        setting = db.session.get(Setting, key)
        if setting:
            setting.value = str(value)
        else:
            db.session.add(Setting(key=key, value=str(value)))

    db.session.commit()
    settings = Setting.query.all()
    return jsonify({s.key: s.value for s in settings})
