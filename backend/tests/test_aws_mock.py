"""Tests for mocked AWS dependency endpoints."""


def _auth_headers(client) -> dict[str, str]:
    r = client.post(
        "/api/auth/login",
        json={"email": "demo@example.com", "password": "demo1234"},
    )
    return {"Authorization": f"Bearer {r.json()['data']['token']}"}


def test_iam_requires_auth(client):
    r = client.get("/api/aws/iam")
    assert r.status_code == 401


def test_iam_returns_user(client):
    headers = _auth_headers(client)
    r = client.get("/api/aws/iam", headers=headers)
    assert r.status_code == 200
    data = r.json()["data"]
    assert data["username"] == "demo-user"
    assert "arn:aws:iam" in data["arn"]
    assert "AmazonRoute53FullAccess" in data["policies"]


def test_account_returns_info(client):
    headers = _auth_headers(client)
    r = client.get("/api/aws/account", headers=headers)
    assert r.status_code == 200
    data = r.json()["data"]
    assert data["account_id"] == "123456789012"
    assert data["status"] == "ACTIVE"


def test_organizations_returns_info(client):
    headers = _auth_headers(client)
    r = client.get("/api/aws/organizations", headers=headers)
    assert r.status_code == 200
    data = r.json()["data"]
    assert data["organization_id"].startswith("o-")
    assert data["feature_set"] == "ALL"


def test_billing_returns_summary(client):
    headers = _auth_headers(client)
    r = client.get("/api/aws/billing", headers=headers)
    assert r.status_code == 200
    data = r.json()["data"]
    assert data["currency"] == "USD"
    assert data["total_charges"] >= 0
    assert any(s["name"] == "Route 53" for s in data["services"])
