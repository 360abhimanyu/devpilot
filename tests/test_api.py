from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_offline_ask(monkeypatch):
    monkeypatch.setenv("AI_PROVIDER", "offline")
    response = client.post("/api/ask", json={"mode": "git", "prompt": "How do I create a branch?"})
    assert response.status_code == 200
    data = response.json()
    assert data["provider"] == "offline"
    assert "Git workflow" in data["answer"]
