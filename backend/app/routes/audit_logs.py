from flask import Blueprint, jsonify, request
from app.models.audit_log import AuditLog
from app.auth import require_api_key

audit_logs_bp = Blueprint("audit_logs", __name__)


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
