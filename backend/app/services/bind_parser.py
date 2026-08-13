"""BIND zone file parser.

Parses a BIND-format zone file into a list of record dicts. Each dict has
keys: name, type, ttl, value. Supports the record types required by the
assignment: A, AAAA, CNAME, TXT, MX, NS, PTR, SRV, CAA, SOA.

The parser is intentionally lenient with whitespace and comments but strict
about field structure. It does not support $INCLUDE, $ORIGIN, or $TTL
directives beyond basic $ORIGIN resolution.
"""

import re

from app.core.exceptions import ValidationFailedException

# Matches a BIND record line. Captures name, ttl (optional), type, value.
# Examples:
#   www.example.com.  300  IN  A     10.0.0.1
#   @                 900  IN  SOA   ns1.example.com. hostmaster.example.com. 1 7200 900 1209600 86400
#   example.com.      360  IN  MX    10 mail.example.com.
_RECORD_RE = re.compile(
    r"^(?P<name>\S+)\s+(?:(?P<ttl>\d+)\s+)?(?:IN\s+)?(?P<type>[A-Z]+)\s+(?P<value>.+)$",
    re.IGNORECASE,
)

_SUPPORTED_TYPES = {"A", "AAAA", "CNAME", "TXT", "MX", "NS", "PTR", "SRV", "CAA", "SOA"}


def parse_bind_zone(content: str, *, zone_name: str) -> list[dict[str, str | int]]:
    """Parse BIND zone file content into a list of record dicts.

    Raises ValidationFailedException on malformed input.
    """
    records: list[dict[str, str | int]] = []
    origin = zone_name if zone_name.endswith(".") else f"{zone_name}."

    for line_no, raw_line in enumerate(content.splitlines(), start=1):
        line = raw_line.strip()

        # Skip empty lines and comments.
        if not line or line.startswith(";"):
            continue

        # Strip inline comments (BIND allows ; comments at end of line).
        if ";" in line:
            # But not inside quoted TXT values. Simple heuristic: only strip
            # if the semicolon is outside quotes.
            in_quote = False
            cut_idx = len(line)
            for i, ch in enumerate(line):
                if ch == '"':
                    in_quote = not in_quote
                elif ch == ";" and not in_quote:
                    cut_idx = i
                    break
            line = line[:cut_idx].strip()
            if not line:
                continue

        # Handle $ORIGIN directive.
        if line.upper().startswith("$ORIGIN"):
            parts = line.split()
            if len(parts) < 2:
                raise ValidationFailedException(f"line {line_no}: $ORIGIN requires a value")
            origin = parts[1].lower()
            if not origin.endswith("."):
                origin += "."
            continue

        # Skip $TTL directive (we use per-record TTL or default).
        if line.upper().startswith("$TTL"):
            continue

        match = _RECORD_RE.match(line)
        if not match:
            raise ValidationFailedException(f"line {line_no}: cannot parse '{raw_line.strip()}'")

        name = match.group("name")
        ttl_raw = match.group("ttl")
        rtype = match.group("type").upper()
        value = match.group("value").strip()

        if rtype not in _SUPPORTED_TYPES:
            raise ValidationFailedException(f"line {line_no}: unsupported record type '{rtype}'")

        # Resolve @ to origin.
        if name == "@":
            name = origin
        elif not name.endswith("."):
            # Relative name, append origin.
            name = f"{name.lower()}.{origin}"
        else:
            name = name.lower()

        ttl = int(ttl_raw) if ttl_raw else 300

        records.append({
            "name": name,
            "type": rtype,
            "ttl": ttl,
            "value": value,
        })

    return records
