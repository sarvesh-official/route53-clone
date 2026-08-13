"""Tests for JSON and BIND zone export."""

import uuid

ZONES = "/api/hosted-zones"


def _auth_headers(client) -> dict[str, str]:
    r = client.post(
        "/api/auth/login",
        json={"email": "demo@example.com", "password": "demo1234"},
    )
    return {"Authorization": f"Bearer {r.json()['data']['token']}"}


def _make_zone(client, headers) -> dict:
    name = f"exp-{uuid.uuid4().hex[:6]}.example.com."
    r = client.post(ZONES, json={"name": name, "type": "PUBLIC"}, headers=headers)
    return r.json()


def test_export_json(client):
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)
    zid = zone["id"]

    r = client.get(f"{ZONES}/{zid}/export", headers=headers)
    assert r.status_code == 200
    data = r.json()["data"]
    assert data["zone"]["name"] == zone["name"]
    assert len(data["records"]) >= 2  # NS + SOA from bootstrap


def test_export_bind(client):
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)
    zid = zone["id"]

    r = client.get(f"{ZONES}/{zid}/export?format=bind", headers=headers)
    assert r.status_code == 200
    text = r.text
    assert "$ORIGIN" in text
    assert "SOA" in text
    assert "NS" in text
    assert zone["name"] in text


def test_export_requires_auth(client):
    r = client.get(f"{ZONES}/fake/export")
    assert r.status_code == 401


def test_cross_user_cannot_export(client):
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)

    r = client.post(
        "/api/auth/login",
        json={"email": "other@example.com", "password": "other1234"},
    )
    other_headers = {"Authorization": f"Bearer {r.json()['data']['token']}"}

    r = client.get(f"{ZONES}/{zone['id']}/export", headers=other_headers)
    assert r.status_code == 404


def test_export_includes_imported_records(client):
    """Export should include records added via the import endpoint."""
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)
    zid = zone["id"]

    # Add a record.
    client.post(
        f"{ZONES}/{zid}/records",
        json={"name": "www", "type": "A", "ttl": 300, "value": "10.0.0.1"},
        headers=headers,
    )

    # Export JSON and verify the record is there.
    r = client.get(f"{ZONES}/{zid}/export", headers=headers)
    data = r.json()["data"]
    a_records = [rec for rec in data["records"] if rec["type"] == "A"]
    assert len(a_records) == 1
    assert a_records[0]["value"] == "10.0.0.1"

    # Export BIND and verify.
    r = client.get(f"{ZONES}/{zid}/export?format=bind", headers=headers)
    assert "10.0.0.1" in r.text
