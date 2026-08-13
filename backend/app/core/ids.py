"""Route 53-style ID generators.

Route 53 generates hosted zone IDs like Z0578539191JQTWD5AS7B and
record IDs like R0578539191JQTWD5AS7B. The format is a single-letter
prefix (Z for zones, R for records) followed by a base32-encoded
random string. We replicate this format so our IDs look authentic.
"""

from __future__ import annotations

import secrets
import string

# Base32 alphabet (RFC 4648, uppercase, no padding)
_B32_ALPHABET = string.ascii_uppercase + "234567"


def _random_base32(length: int = 20) -> str:
    """Generate a random base32 string of the given length."""
    return "".join(secrets.choice(_B32_ALPHABET) for _ in range(length))


def generate_zone_id() -> str:
    """Generate a Route 53-style hosted zone ID (Z + 20 base32 chars)."""
    return f"Z{_random_base32()}"


def generate_record_id() -> str:
    """Generate a Route 53-style record ID (R + 20 base32 chars)."""
    return f"R{_random_base32()}"


def generate_session_id() -> str:
    """Generate a UUID-style session ID (S + 20 base32 chars)."""
    return f"S{_random_base32()}"


def generate_session_token() -> str:
    """Generate a random session token (hex string)."""
    return secrets.token_hex(32)
