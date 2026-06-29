from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "Al-Rawi" in response.text
    assert "html" in response.headers["content-type"]


def test_health_endpoint():
    # Since DATABASE_URL is required, mock or allow check to gracefully handle connection failure
    response = client.get("/health")
    assert response.status_code == 200
    json_data = response.json()
    assert "status" in json_data
    assert "database" in json_data
    assert "redis" in json_data
    assert "version" in json_data


def test_api_v1_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
