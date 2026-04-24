import os
from flask import Blueprint, jsonify, request, abort
from app.models.audit_log import AuditLog

audit_logs_bp = Blueprint("audit_logs", __name__)


def require_api_key():
    auth = request.headers.get("Authorization", "")
    expected = f"Bearer {os.environ.get('API_SECRET_KEY', '')}"
    if not auth or auth != expected:
        abort(401)


@audit_logs_bp.route("/", methods=["GET"])
def list_audit_logs():
    require_api_key()
    page        = request.args.get("page", 1, type=int)
    per_page    = min(request.args.get("per_page", 30, type=int), 100)
    entity_type = request.args.get("entity_type")

    query = AuditLog.query
    if entity_type:
        query = query.filter(AuditLog.entity_type == entity_type)

    query = query.order_by(AuditLog.created_at.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "items": [log.to_dict() for log in pagination.items],
        "total": pagination.total,
        "page":  pagination.page,
        "pages": pagination.pages,
    })
