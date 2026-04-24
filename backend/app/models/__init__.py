# Re-export all models so a single import registers them with SQLAlchemy metadata.
# app.py does: from app.models import register_models; register_models()

from app.models.artist import Artist
from app.models.artwork import Artwork
from app.models.exhibition import Exhibition
from app.models.testimonial import Testimonial
from app.models.setting import Setting
from app.models.audit_log import AuditLog

__all__ = ["Artist", "Artwork", "Exhibition", "Testimonial", "Setting", "AuditLog"]