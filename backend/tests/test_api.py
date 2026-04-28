"""Smoke tests — run with: cd backend && pytest tests/"""
import os
import pytest

os.environ.setdefault("SECRET_KEY", "test-secret")
os.environ.setdefault("API_SECRET_KEY", "test-api-key")
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("ALLOWED_ORIGINS", "http://localhost:3000")


@pytest.fixture(scope="session")
def client():
    from wsgi import create_app
    flask_app = create_app()
    flask_app.config["TESTING"] = True
    with flask_app.test_client() as c:
        yield c


AUTH = {"Authorization": "Bearer test-api-key"}


# ── Health ────────────────────────────────────────────────────────────────────

def test_root(client):
    r = client.get("/")
    assert r.status_code == 200
    assert r.get_json()["status"] == "ok"


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.get_json()["db"] is True


# ── Artworks ──────────────────────────────────────────────────────────────────

def test_list_artworks_empty(client):
    r = client.get("/api/artworks/")
    assert r.status_code == 200
    data = r.get_json()
    assert data["items"] == []
    assert data["total"] == 0


def test_create_artwork_requires_auth(client):
    r = client.post("/api/artworks/", json={"title": "Test"})
    assert r.status_code == 401


def test_create_and_get_artwork(client):
    payload = {
        "title": "Paisagem Urbana",
        "artist": "Maria Franca",
        "year": "2024",
        "category": "Pintura",
        "available": "disponível",
    }
    r = client.post("/api/artworks/", json=payload, headers=AUTH)
    assert r.status_code == 201
    art = r.get_json()
    assert art["title"] == "Paisagem Urbana"
    assert art["artist"] == "Maria Franca"

    r2 = client.get(f"/api/artworks/{art['id']}")
    assert r2.status_code == 200
    assert r2.get_json()["id"] == art["id"]


def test_create_artwork_missing_title(client):
    r = client.post("/api/artworks/", json={"year": "2024"}, headers=AUTH)
    assert r.status_code == 400


def test_create_artwork_title_too_long(client):
    r = client.post("/api/artworks/", json={"title": "x" * 201}, headers=AUTH)
    assert r.status_code == 400


def test_404_returns_json(client):
    r = client.get("/api/artworks/999999")
    assert r.status_code == 404
    assert "error" in r.get_json()


# ── Exhibitions ───────────────────────────────────────────────────────────────

def test_list_exhibitions_empty(client):
    r = client.get("/api/exhibitions/")
    assert r.status_code == 200
    assert r.get_json() == []


def test_create_and_filter_exhibition(client):
    payload = {
        "title": "Arte Contemporânea",
        "start_date": "2020-01-01",
        "end_date": "2020-12-31",
    }
    r = client.post("/api/exhibitions/", json=payload, headers=AUTH)
    assert r.status_code == 201

    r2 = client.get("/api/exhibitions/?status=encerrada")
    assert r2.status_code == 200
    titles = [e["title"] for e in r2.get_json()]
    assert "Arte Contemporânea" in titles