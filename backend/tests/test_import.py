"""Tests for BIND zone file import."""

import uuid

ZONES = "/api/hosted-zones"

_BIND_SAMPLE = """$ORIGIN example.com.
$TTL 300
@           172800  IN  NS    ns1.example.com.
@           172800  IN  NS    ns2.example.com.
www         300     IN  A     10.0.0.1
api         300     IN  A     10.0.0.2
mail        300     IN  MX    10 mail.example.com.
@           300     IN  TXT   "v=spf1 include:_spf.example.com ~all"
"""


def _auth_headers(client) -> dict[str, str]:
    r = client.post(
        "/api/auth/login",
        json={"email": "demo@example.com", "password": "demo1234"},
    )
    return {"Authorization": f"Bearer {r.json()['data']['token']}"}


def _make_zone(client, headers) -> dict:
    name = f"imp-{uuid.uuid4().hex[:6]}.example.com."
    r = client.post(ZONES, json={"name": name, "type": "PUBLIC"}, headers=headers)
    return r.json()


def test_import_bind_adds_records(client):
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)
    zid = zone["id"]

    content = _BIND_SAMPLE.replace("example.com.", zone["name"])

    r = client.post(
        f"{ZONES}/{zid}/import",
        content=content,
        headers={**headers, "Content-Type": "text/plain"},
    )
    assert r.status_code == 200
    data = r.json()["data"]
    # NS at apex already exists from bootstrap, so it gets skipped.
    # We expect: www A, api A, mail MX, TXT.
    assert data["imported_count"] == 4

    r = client.get(f"{ZONES}/{zid}/records", params={"page_size": 100}, headers=headers)
    types = {rec["type"] for rec in r.json()["items"]}
    assert {"A", "MX", "TXT", "NS", "SOA"} <= types


def test_import_bind_skips_duplicates(client):
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)
    zid = zone["id"]

    content = _BIND_SAMPLE.replace("example.com.", zone["name"])
    r = client.post(
        f"{ZONES}/{zid}/import",
        content=content,
        headers={**headers, "Content-Type": "text/plain"},
    )
    assert r.status_code == 200
    first_count = r.json()["data"]["imported_count"]

    # Import again, should skip all.
    r = client.post(
        f"{ZONES}/{zid}/import",
        content=content,
        headers={**headers, "Content-Type": "text/plain"},
    )
    assert r.status_code == 200
    assert r.json()["data"]["imported_count"] == 0
    assert first_count == 4


def test_import_requires_auth(client):
    r = client.post(f"{ZONES}/fake/import", content="test")
    assert r.status_code == 401


def test_cross_user_cannot_import(client):
    headers = _auth_headers(client)
    zone = _make_zone(client, headers)

    r = client.post(
        "/api/auth/login",
        json={"email": "other@example.com", "password": "other1234"},
    )
    other_headers = {"Authorization": f"Bearer {r.json()['data']['token']}"}

    r = client.post(
        f"{ZONES}/{zone['id']}/import",
        content="$ORIGIN test.com.\nwww 300 IN A 10.0.0.1",
        headers={**other_headers, "Content-Type": "text/plain"},
    )
    assert r.status_code == 404
