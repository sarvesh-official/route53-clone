"""Tests for bulk delete operations."""

import uuid

ZONES = "/api/hosted-zones"


def _auth_headers(client) -> dict[str, str]:
    r = client.post(
        "/api/auth/login",
        json={"email": "demo@example.com", "password": "demo1234"},
    )
    return {"Authorization": f"Bearer {r.json()['data']['token']}"}


def _make_zone(client, headers) -> dict:
    name = f"bulk-{uuid.uuid4().hex[:6]}.example.com."
    r = client.post(ZONES, json={"name": name, "type": "PUBLIC"}, headers=headers)
    return r.json()


def test_bulk_delete_records(client):
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)

    # Create 3 records.
    rids = []
    for i in range(3):
        r = client.post(
            f"{ZONES}/{zone['id']}/records",
            json={"name": f"host{i}", "type": "A", "ttl": 300, "value": f"10.0.0.{i+1}"},
            headers=headers,
        )
        rids.append(r.json()["id"])

    # Bulk delete 2 of them.
    r = client.post(
        "/api/records/bulk-delete",
        json={"record_ids": rids[:2]},
        headers=headers,
    )
    assert r.status_code == 200
    assert r.json()["deleted"] == 2
    assert r.json()["skipped"] == 0

    # Verify the third one still exists.
    r = client.get(f"/api/records/{rids[2]}", headers=headers)
    assert r.status_code == 200


def test_bulk_delete_records_skips_unowned(client):
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)

    r = client.post(
        f"{ZONES}/{zone['id']}/records",
        json={"name": "www", "type": "A", "ttl": 300, "value": "10.0.0.1"},
        headers=headers,
    )
    rid = r.json()["id"]

    # Login as other user and try to bulk delete.
    r = client.post(
        "/api/auth/login",
        json={"email": "other@example.com", "password": "other1234"},
    )
    other_headers = {"Authorization": f"Bearer {r.json()['data']['token']}"}

    r = client.post(
        "/api/records/bulk-delete",
        json={"record_ids": [rid]},
        headers=other_headers,
    )
    assert r.status_code == 200
    assert r.json()["deleted"] == 0
    assert r.json()["skipped"] == 1


def test_bulk_delete_records_requires_auth(client):
    r = client.post("/api/records/bulk-delete", json={"record_ids": ["fake"]})
    assert r.status_code == 401


def test_bulk_delete_zones(client):
    headers = _auth_headers(client)
    z1 = _make_zone(client, headers)
    z2 = _make_zone(client, headers)

    r = client.post(
        f"{ZONES}/bulk-delete",
        json={"zone_ids": [z1["id"], z2["id"]]},
        headers=headers,
    )
    assert r.status_code == 200
    assert r.json()["deleted"] == 2
    assert r.json()["skipped"] == 0

    # Verify they are gone.
    r = client.get(f"{ZONES}/{z1['id']}", headers=headers)
    assert r.status_code == 404


def test_bulk_delete_zones_skips_unowned(client):
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)

    r = client.post(
        "/api/auth/login",
        json={"email": "other@example.com", "password": "other1234"},
    )
    other_headers = {"Authorization": f"Bearer {r.json()['data']['token']}"}

    r = client.post(
        f"{ZONES}/bulk-delete",
        json={"zone_ids": [zone["id"]]},
        headers=other_headers,
    )
    assert r.status_code == 200
    assert r.json()["deleted"] == 0
    assert r.json()["skipped"] == 1


def test_bulk_delete_zones_requires_auth(client):
    r = client.post(f"{ZONES}/bulk-delete", json={"zone_ids": ["fake"]})
    assert r.status_code == 401


def test_bulk_delete_empty_list_rejected(client):
    headers = _auth_headers(client)
    r = client.post("/api/records/bulk-delete", json={"record_ids": []}, headers=headers)
    assert r.status_code == 422
