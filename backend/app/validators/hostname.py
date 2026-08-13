"""Hostname and domain-label validation primitives."""

import re

from app.core.exceptions import ValidationFailedException

_HOSTNAME_RE = re.compile(
    r"^(?=.{1,253}\.?$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}\.?$",
    re.IGNORECASE,
)


def normalize_hostname(raw: str, *, field: str = "value") -> str:
    """Lowercase, trim, ensure trailing dot, and reject malformed hostnames."""
    if raw is None:
        raise ValidationFailedException(f"{field}: hostname is required")
    h = raw.strip().lower()
    if not h:
        raise ValidationFailedException(f"{field}: hostname is required")
    if not h.endswith("."):
        h += "."
    if not _HOSTNAME_RE.match(h):
        raise ValidationFailedException(f"{field}: '{raw}' is not a valid hostname")
    return h
