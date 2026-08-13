"""Tests for hosted-zone CRUD, pagination, search, filter, and sort."""

import uuid

API = "/api/hosted-zones"


def _unique_name() -> str:
    return f"z-{uuid.uuid4().hex[:8]}.example.com."


def _auth_headers(client) -> dict[str, str]:
    r = client.post(
        "/api/auth/login",
        json={"email": "demo@example.com", "password": "demo1234"},
    )
    token = r.json()["data"]["token"]
    return {"Authorization": f"Bearer {token}"}


def test_list_requires_auth(client):
    r = client.get(API)
    assert r.status_code == 401


def test_create_get_update_delete(client):
    headers = _auth_headers(client)
    name = _unique_name()

    r = client.post(API, json={"name": name, "type": "PUBLIC", "comment": "hi"}, headers=headers)
    assert r.status_code == 201
    zone = r.json()
    assert zone["id"].startswith("Z")
    assert zone["name"] == name
    assert zone["type"] == "PUBLIC"
    assert zone["record_count"] == 2  # Auto-created NS + SOA

    zid = zone["id"]

    r = client.get(f"{API}/{zid}", headers=headers)
    assert r.status_code == 200 and r.json()["id"] == zid

    r = client.patch(f"{API}/{zid}", json={"comment": "updated"}, headers=headers)
    assert r.status_code == 200 and r.json()["comment"] == "updated"

    r = client.delete(f"{API}/{zid}", headers=headers)
    assert r.status_code == 204

    r = client.get(f"{API}/{zid}", headers=headers)
    assert r.status_code == 404


def test_duplicate_zone_name_type_conflicts(client):
    headers = _auth_headers(client)
    name = _unique_name()

    r1 = client.post(API, json={"name": name, "type": "PUBLIC"}, headers=headers)
    assert r1.status_code == 201

    r2 = client.post(API, json={"name": name, "type": "PUBLIC"}, headers=headers)
    assert r2.status_code == 409


def test_domain_validation(client):
    headers = _auth_headers(client)
    r = client.post(API, json={"name": "not a domain", "type": "PUBLIC"}, headers=headers)
    assert r.status_code == 422


def test_pagination_search_filter_sort(client):
    headers = _auth_headers(client)
    created = []
    for i in range(5):
        n = f"paged-{i}-{uuid.uuid4().hex[:6]}.example.com."
        r = client.post(API, json={"name": n, "type": "PUBLIC"}, headers=headers)
        assert r.status_code == 201
        created.append(r.json()["id"])

    # Filter by PRIVATE type, expect 0 (we created PUBLIC zones).
    r = client.get(API, params={"type": "PRIVATE"}, headers=headers)
    assert r.status_code == 200
    assert all(z["type"] == "PRIVATE" for z in r.json()["items"])

    # Search by substring.
    sample = created[0]
    r = client.get(API, params={"search": sample[:10]}, headers=headers)
    assert r.status_code == 200
    assert any(z["id"] == sample for z in r.json()["items"])

    # Sort by name ascending.
    r = client.get(API, params={"page_size": 100, "sort": "name:asc"}, headers=headers)
    assert r.status_code == 200
    names = [z["name"] for z in r.json()["items"]]
    assert names == sorted(names)

    # Pagination.
    r = client.get(API, params={"page": 1, "page_size": 2}, headers=headers)
    body = r.json()
    assert r.status_code == 200
    assert body["page"] == 1 and body["page_size"] == 2 and len(body["items"]) == 2
    assert body["total"] >= 5
