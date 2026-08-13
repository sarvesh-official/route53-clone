"""Tests for the authentication endpoints."""


def test_login_and_me_and_logout(client):
    r = client.post(
        "/api/auth/login",
        json={"email": "demo@example.com", "password": "demo1234"},
    )
    assert r.status_code == 200
    token = r.json()["data"]["token"]
    assert isinstance(token, str) and len(token) > 20

    r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["data"]["email"] == "demo@example.com"

    r = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 204

    r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 401


def test_bad_password_returns_401(client):
    r = client.post(
        "/api/auth/login",
        json={"email": "demo@example.com", "password": "nope"},
    )
    assert r.status_code == 401
    body = r.json()
    assert body["code"] == "INVALID_CREDENTIALS"


def test_nonexistent_user_returns_401(client):
    r = client.post(
        "/api/auth/login",
        json={"email": "nobody@example.com", "password": "demo1234"},
    )
    assert r.status_code == 401
    assert r.json()["code"] == "INVALID_CREDENTIALS"


def test_validation_error_on_bad_email(client):
    r = client.post(
        "/api/auth/login",
        json={"email": "not-an-email", "password": ""},
    )
    assert r.status_code == 422
    assert r.json()["code"] == "VALIDATION_ERROR"


def test_me_without_token_is_unauthorized(client):
    r = client.get("/api/auth/me")
    assert r.status_code == 401
    assert r.json()["code"] == "TOKEN_MISSING"


def test_me_with_invalid_token_is_unauthorized(client):
    r = client.get("/api/auth/me", headers={"Authorization": "Bearer invalidtoken123"})
    assert r.status_code == 401
    assert r.json()["code"] == "TOKEN_INVALID"
