"""Tests for DNS record CRUD, auto NS/SOA, record_count maintenance, validation."""

import uuid

ZONES = "/api/hosted-zones"


def _auth_headers(client) -> dict[str, str]:
    r = client.post(
        "/api/auth/login",
        json={"email": "demo@example.com", "password": "demo1234"},
    )
    token = r.json()["data"]["token"]
    return {"Authorization": f"Bearer {token}"}


def _make_zone(client, headers) -> dict:
    name = f"r-{uuid.uuid4().hex[:8]}.example.com."
    r = client.post(ZONES, json={"name": name, "type": "PUBLIC"}, headers=headers)
    assert r.status_code == 201
    return r.json()


def test_zone_create_auto_adds_ns_and_soa(client):
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)
    assert zone["record_count"] == 2

    r = client.get(f"{ZONES}/{zone['id']}/records", headers=headers)
    assert r.status_code == 200
    types = {rec["type"] for rec in r.json()["items"]}
    assert {"NS", "SOA"} <= types


def test_record_crud_and_record_count(client):
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)
    zid = zone["id"]

    r = client.post(
        f"{ZONES}/{zid}/records",
        json={"name": "www", "type": "A", "ttl": 300, "value": "10.0.0.1"},
        headers=headers,
    )
    assert r.status_code == 201
    rec = r.json()
    assert rec["name"] == f"www.{zone['name']}"
    assert rec["value"] == "10.0.0.1"
    rid = rec["id"]

    # Zone record_count bumps to 3 (NS + SOA + A).
    r = client.get(f"{ZONES}/{zid}", headers=headers)
    assert r.json()["record_count"] == 3

    # Patch TTL.
    r = client.patch(f"/api/records/{rid}", json={"ttl": 60}, headers=headers)
    assert r.status_code == 200 and r.json()["ttl"] == 60

    # Delete and verify count decrements.
    r = client.delete(f"/api/records/{rid}", headers=headers)
    assert r.status_code == 204
    r = client.get(f"{ZONES}/{zid}", headers=headers)
    assert r.json()["record_count"] == 2


def test_duplicate_name_type_in_zone_conflicts(client):
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)
    payload = {"name": "dup", "type": "A", "ttl": 300, "value": "10.0.0.5"}
    r1 = client.post(f"{ZONES}/{zone['id']}/records", json=payload, headers=headers)
    assert r1.status_code == 201
    r2 = client.post(f"{ZONES}/{zone['id']}/records", json=payload, headers=headers)
    assert r2.status_code == 409


def test_record_validation_errors(client):
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)

    # Bad IP.
    r = client.post(
        f"{ZONES}/{zone['id']}/records",
        json={"name": "x", "type": "A", "ttl": 300, "value": "not-ip"},
        headers=headers,
    )
    assert r.status_code == 400 and r.json()["code"] == "VALIDATION_FAILED"

    # Out-of-zone name.
    r = client.post(
        f"{ZONES}/{zone['id']}/records",
        json={"name": "evil.other.com.", "type": "A", "ttl": 300, "value": "10.0.0.1"},
        headers=headers,
    )
    assert r.status_code == 400 and r.json()["code"] == "VALIDATION_FAILED"

    # CNAME at apex is rejected.
    r = client.post(
        f"{ZONES}/{zone['id']}/records",
        json={"name": "@", "type": "CNAME", "ttl": 300, "value": "target.example.com."},
        headers=headers,
    )
    assert r.status_code == 400 and r.json()["code"] == "VALIDATION_FAILED"


def test_records_list_pagination_search_filter(client):
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)
    for i in range(4):
        client.post(
            f"{ZONES}/{zone['id']}/records",
            json={"name": f"host{i}", "type": "A", "ttl": 300, "value": f"10.0.0.{i+1}"},
            headers=headers,
        )

    # Type filter.
    r = client.get(
        f"{ZONES}/{zone['id']}/records",
        params={"type": "A", "page_size": 100},
        headers=headers,
    )
    body = r.json()
    assert r.status_code == 200
    assert all(rec["type"] == "A" for rec in body["items"])
    assert body["total"] == 4

    # Pagination.
    r = client.get(
        f"{ZONES}/{zone['id']}/records",
        params={"page": 1, "page_size": 2},
        headers=headers,
    )
    body = r.json()
    assert r.status_code == 200
    assert len(body["items"]) == 2 and body["total"] >= 4

    # Search by value substring.
    r = client.get(
        f"{ZONES}/{zone['id']}/records",
        params={"search": "10.0.0.2"},
        headers=headers,
    )
    body = r.json()
    assert any(rec["value"] == "10.0.0.2" for rec in body["items"])


def _other_headers(client) -> dict[str, str]:
    r = client.post(
        "/api/auth/login",
        json={"email": "other@example.com", "password": "other1234"},
    )
    token = r.json()["data"]["token"]
    return {"Authorization": f"Bearer {token}"}


def test_cross_user_cannot_access_zone_records(client):
    """User A's zone records are invisible to user B."""
    headers = _auth_headers(client)
    other = _other_headers(client)

    zone = _make_zone(client, headers)

    # User B cannot list records in user A's zone.
    r = client.get(f"{ZONES}/{zone['id']}/records", headers=other)
    assert r.status_code == 404

    # User B cannot create records in user A's zone.
    r = client.post(
        f"{ZONES}/{zone['id']}/records",
        json={"name": "evil", "type": "A", "ttl": 300, "value": "10.0.0.1"},
        headers=other,
    )
    assert r.status_code == 404


def test_cross_user_cannot_access_record_by_id(client):
    """User A's record is invisible to user B via /api/records/{id}."""
    headers = _auth_headers(client)
    other = _other_headers(client)

    zone = _make_zone(client, headers)
    r = client.post(
        f"{ZONES}/{zone['id']}/records",
        json={"name": "www", "type": "A", "ttl": 300, "value": "10.0.0.1"},
        headers=headers,
    )
    rid = r.json()["id"]

    # User B cannot get user A's record.
    r = client.get(f"/api/records/{rid}", headers=other)
    assert r.status_code == 404

    # User B cannot update user A's record.
    r = client.patch(f"/api/records/{rid}", json={"ttl": 99}, headers=other)
    assert r.status_code == 404

    # User B cannot delete user A's record.
    r = client.delete(f"/api/records/{rid}", headers=other)
    assert r.status_code == 404


def test_record_update_validates_value(client):
    """Updating a record with a bad value still runs validation."""
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)

    r = client.post(
        f"{ZONES}/{zone['id']}/records",
        json={"name": "www", "type": "A", "ttl": 300, "value": "10.0.0.1"},
        headers=headers,
    )
    rid = r.json()["id"]

    # Bad IP on update.
    r = client.patch(f"/api/records/{rid}", json={"value": "not-an-ip"}, headers=headers)
    assert r.status_code == 400 and r.json()["code"] == "VALIDATION_FAILED"

    # TTL out of range on update.
    r = client.patch(f"/api/records/{rid}", json={"ttl": 999999}, headers=headers)
    assert r.status_code == 422


def test_record_name_normalization_through_api(client):
    """The @ symbol and relative names are normalized through the API."""
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)

    # @ resolves to apex.
    r = client.post(
        f"{ZONES}/{zone['id']}/records",
        json={"name": "@", "type": "A", "ttl": 300, "value": "10.0.0.1"},
        headers=headers,
    )
    assert r.status_code == 201
    assert r.json()["name"] == zone["name"]

    # Relative name resolves to subdomain.
    r = client.post(
        f"{ZONES}/{zone['id']}/records",
        json={"name": "api", "type": "A", "ttl": 300, "value": "10.0.0.2"},
        headers=headers,
    )
    assert r.status_code == 201
    assert r.json()["name"] == f"api.{zone['name']}"
