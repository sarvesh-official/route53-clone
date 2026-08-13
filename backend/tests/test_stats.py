"""Tests for dashboard stats and activity feed."""

import uuid

ZONES = "/api/hosted-zones"


def _auth_headers(client) -> dict[str, str]:
    r = client.post(
        "/api/auth/login",
        json={"email": "demo@example.com", "password": "demo1234"},
    )
    return {"Authorization": f"Bearer {r.json()['data']['token']}"}


def _make_zone(client, headers) -> dict:
    name = f"stats-{uuid.uuid4().hex[:6]}.example.com."
    r = client.post(ZONES, json={"name": name, "type": "PUBLIC"}, headers=headers)
    return r.json()


def test_stats_requires_auth(client):
    r = client.get("/api/stats")
    assert r.status_code == 401


def test_stats_returns_counts(client):
    headers = _auth_headers(client)
    _make_zone(client, headers)

    r = client.get("/api/stats", headers=headers)
    assert r.status_code == 200
    data = r.json()
    assert data["total_zones"] >= 1
    assert data["public_zones"] >= 1
    assert data["total_records"] >= 2  # NS + SOA


def test_stats_reflects_new_records(client):
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)

    # Add a record.
    client.post(
        f"{ZONES}/{zone['id']}/records",
        json={"name": "www", "type": "A", "ttl": 300, "value": "10.0.0.1"},
        headers=headers,
    )

    r = client.get("/api/stats", headers=headers)
    data = r.json()
    assert data["total_records"] >= 3  # NS + SOA + A


def test_activity_requires_auth(client):
    r = client.get("/api/stats/activity")
    assert r.status_code == 401


def test_activity_returns_buckets(client):
    headers = _auth_headers(client)
    _make_zone(client, headers)

    r = client.get("/api/stats/activity?days=7", headers=headers)
    assert r.status_code == 200
    data = r.json()
    assert len(data["buckets"]) == 7
    # Today's bucket should have at least 2 records (NS + SOA from bootstrap).
    assert data["buckets"][-1]["records_created"] >= 2


def test_activity_respects_days_param(client):
    headers = _auth_headers(client)
    _make_zone(client, headers)

    r = client.get("/api/stats/activity?days=3", headers=headers)
    assert r.status_code == 200
    assert len(r.json()["buckets"]) == 3


def test_activity_rejects_invalid_days(client):
    headers = _auth_headers(client)
    r = client.get("/api/stats/activity?days=0", headers=headers)
    assert r.status_code == 422

    r = client.get("/api/stats/activity?days=100", headers=headers)
    assert r.status_code == 422
