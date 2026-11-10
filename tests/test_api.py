from fastapi.testclient import TestClient
from backend.main import app

def test_health_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_requirement_validation():
    with TestClient(app) as client:
        response = client.post("/api/workflow/run", json={"requirement": "too short"})
    assert response.status_code == 422
