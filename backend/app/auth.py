import os
import hmac
from functools import wraps
from flask import request, abort


def require_api_key(f=None):
    """Decorator — aborts 401 if Authorization header doesn't match API_SECRET_KEY."""
    def _check():
        expected = os.environ.get("API_SECRET_KEY", "")
        auth     = request.headers.get("Authorization", "")
        token    = auth.removeprefix("Bearer ").strip()
        if not expected or not hmac.compare_digest(token, expected):
            abort(401)

    if f is None:
        _check()
        return

    @wraps(f)
    def decorated(*args, **kwargs):
        _check()
        return f(*args, **kwargs)
    return decorated