"""Per-record-type validator tests covering happy and error paths for all types."""

import pytest

from app.core.exceptions import ValidationFailedException
from app.validators.registry import (
    normalize_record_name,
    validate_ttl,
    validate_value,
)


def _ok(rtype: str, val: str, *, name: str = "x.example.com.") -> str:
    return validate_value(rtype, val, name=name, zone_name="example.com.")


def _bad(rtype: str, val: str, *, name: str = "x.example.com.") -> None:
    with pytest.raises(ValidationFailedException):
        validate_value(rtype, val, name=name, zone_name="example.com.")


# ---------------------------------------------------------------------------
# A record
# ---------------------------------------------------------------------------

def test_a_record_accepts_valid_ipv4():
    assert _ok("A", "10.0.0.1") == "10.0.0.1"
    assert _ok("A", "192.168.1.1") == "192.168.1.1"

def test_a_record_rejects_non_ip():
    _bad("A", "not-an-ip")

def test_a_record_rejects_out_of_range_octet():
    _bad("A", "999.0.0.1")

def test_a_record_rejects_ipv6():
    _bad("A", "2001:db8::1")


# ---------------------------------------------------------------------------
# AAAA record
# ---------------------------------------------------------------------------

def test_aaaa_record_accepts_valid_ipv6():
    assert _ok("AAAA", "2001:db8::1") == "2001:db8::1"

def test_aaaa_record_rejects_ipv4():
    _bad("AAAA", "10.0.0.1")

def test_aaaa_record_rejects_garbage():
    _bad("AAAA", "not-an-ip")


# ---------------------------------------------------------------------------
# CNAME record
# ---------------------------------------------------------------------------

def test_cname_accepts_valid_hostname():
    assert _ok("CNAME", "target.example.com") == "target.example.com."

def test_cname_blocked_at_apex():
    _bad("CNAME", "target.example.com.", name="example.com.")

def test_cname_allows_subdomain():
    assert _ok("CNAME", "target.example.com", name="www.example.com.") == "target.example.com."


# ---------------------------------------------------------------------------
# MX record
# ---------------------------------------------------------------------------

def test_mx_accepts_priority_and_hostname():
    assert _ok("MX", "10 mail.example.com") == "10 mail.example.com."

def test_mx_rejects_missing_priority():
    _bad("MX", "mail.example.com")

def test_mx_rejects_priority_out_of_range():
    _bad("MX", "99999 mail.example.com.")

def test_mx_rejects_negative_priority():
    _bad("MX", "-1 mail.example.com.")

def test_mx_accepts_multiple_lines():
    out = _ok("MX", "10 mail1.example.com\n20 mail2.example.com")
    assert "10 mail1.example.com." in out
    assert "20 mail2.example.com." in out


# ---------------------------------------------------------------------------
# SRV record
# ---------------------------------------------------------------------------

def test_srv_accepts_four_field_format():
    assert _ok("SRV", "10 5 5060 sip.example.com") == "10 5 5060 sip.example.com."

def test_srv_rejects_missing_field():
    _bad("SRV", "10 5 sip.example.com")

def test_srv_rejects_port_zero():
    _bad("SRV", "10 5 0 sip.example.com")

def test_srv_rejects_weight_out_of_range():
    _bad("SRV", "10 99999 5060 sip.example.com")


# ---------------------------------------------------------------------------
# CAA record
# ---------------------------------------------------------------------------

def test_caa_accepts_valid_flags_tag_value():
    out = _ok("CAA", "0 issue letsencrypt.org")
    assert out == '0 issue "letsencrypt.org"'

def test_caa_rejects_bad_tag():
    _bad("CAA", "0 badtag letsencrypt.org")

def test_caa_rejects_flags_out_of_range():
    _bad("CAA", "999 issue letsencrypt.org")

def test_caa_accepts_iodef_tag():
    out = _ok("CAA", "0 iodef mailto:admin@example.com")
    assert "iodef" in out


# ---------------------------------------------------------------------------
# TXT record
# ---------------------------------------------------------------------------

def test_txt_accepts_plain_string():
    assert _ok("TXT", "hello") == '"hello"'

def test_txt_accepts_quoted_strings():
    assert _ok("TXT", '"a" "b"') == '"a" "b"'

def test_txt_rejects_empty():
    _bad("TXT", "")

def test_txt_rejects_oversized_chunk():
    _bad("TXT", "x" * 256)


# ---------------------------------------------------------------------------
# NS record
# ---------------------------------------------------------------------------

def test_ns_accepts_single_hostname():
    out = _ok("NS", "ns1.example.com")
    assert out == "ns1.example.com."

def test_ns_accepts_multiple_lines():
    out = _ok("NS", "ns1.example.com\nns2.example.com")
    assert "ns1.example.com." in out
    assert "ns2.example.com." in out

def test_ns_rejects_empty():
    _bad("NS", "")


# ---------------------------------------------------------------------------
# PTR record
# ---------------------------------------------------------------------------

def test_ptr_accepts_valid_hostname():
    assert _ok("PTR", "host.example.com") == "host.example.com."

def test_ptr_rejects_garbage():
    _bad("PTR", "not a hostname")


# ---------------------------------------------------------------------------
# Unknown type
# ---------------------------------------------------------------------------

def test_unknown_type_is_rejected():
    _bad("FOO", "anything")


# ---------------------------------------------------------------------------
# TTL bounds
# ---------------------------------------------------------------------------

def test_ttl_accepts_valid_range():
    assert validate_ttl(0) == 0
    assert validate_ttl(300) == 300
    assert validate_ttl(604_800) == 604_800

def test_ttl_rejects_negative():
    with pytest.raises(ValidationFailedException):
        validate_ttl(-1)

def test_ttl_rejects_above_max():
    with pytest.raises(ValidationFailedException):
        validate_ttl(700_000)

def test_ttl_rejects_bool():
    with pytest.raises(ValidationFailedException):
        validate_ttl(True)


# ---------------------------------------------------------------------------
# Record name normalization
# ---------------------------------------------------------------------------

def test_name_at_symbol_resolves_to_apex():
    assert normalize_record_name("@", zone_name="example.com.") == "example.com."

def test_name_empty_resolves_to_apex():
    assert normalize_record_name("", zone_name="example.com.") == "example.com."

def test_name_relative_resolves_to_subdomain():
    assert normalize_record_name("www", zone_name="example.com.") == "www.example.com."

def test_name_fqdn_in_zone_accepted():
    assert normalize_record_name("www.example.com.", zone_name="example.com.") == "www.example.com."

def test_name_case_insensitive():
    assert normalize_record_name("WWW.example.com", zone_name="example.com.") == "www.example.com."

def test_name_out_of_zone_rejected():
    with pytest.raises(ValidationFailedException):
        normalize_record_name("www.other.com.", zone_name="example.com.")
