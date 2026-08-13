"""Validators for record types with structured values: TXT, MX, SRV, CAA."""

import re
from collections.abc import Callable

from app.core.exceptions import ValidationFailedException
from app.validators.hostname import normalize_hostname

_CAA_TAGS = {"issue", "issuewild", "iodef"}

_TXT_CHUNK = re.compile(r'"((?:[^"\\]|\\.)*)"')


def validate_txt(raw: str) -> str:
    s = raw.strip()
    if not s:
        raise ValidationFailedException("value: TXT record cannot be empty")
    parts = _TXT_CHUNK.findall(s) if s.startswith('"') else [s]
    out: list[str] = []
    for chunk in parts:
        if len(chunk) > 255:
            raise ValidationFailedException("value: each TXT string must be <= 255 chars")
        escaped = chunk.replace("\\", "\\\\").replace('"', '\\"')
        out.append(f'"{escaped}"')
    return " ".join(out)


def _validate_mx_line(line: str) -> str:
    parts = line.split()
    if len(parts) != 2:
        raise ValidationFailedException(f"value: MX entry '{line}' must be 'priority hostname'")
    prio_raw, host = parts
    try:
        prio = int(prio_raw)
    except ValueError as exc:
        raise ValidationFailedException(f"value: MX priority '{prio_raw}' is not an integer") from exc
    if not 0 <= prio <= 65535:
        raise ValidationFailedException("value: MX priority must be between 0 and 65535")
    return f"{prio} {normalize_hostname(host)}"


def _validate_srv_line(line: str) -> str:
    parts = line.split()
    if len(parts) != 4:
        raise ValidationFailedException(
            f"value: SRV entry '{line}' must be 'priority weight port target'"
        )
    nums = parts[:3]
    target = parts[3]
    try:
        prio, weight, port = (int(x) for x in nums)
    except ValueError as exc:
        raise ValidationFailedException("value: SRV priority/weight/port must be integers") from exc
    for label, val in (("priority", prio), ("weight", weight)):
        if not 0 <= val <= 65535:
            raise ValidationFailedException(f"value: SRV {label} must be 0..65535")
    if not 1 <= port <= 65535:
        raise ValidationFailedException("value: SRV port must be 1..65535")
    return f"{prio} {weight} {port} {normalize_hostname(target)}"


def _validate_caa_line(line: str) -> str:
    parts = line.split(maxsplit=2)
    if len(parts) != 3:
        raise ValidationFailedException(f"value: CAA entry '{line}' must be 'flags tag value'")
    flags_raw, tag, value = parts
    try:
        flags = int(flags_raw)
    except ValueError as exc:
        raise ValidationFailedException(f"value: CAA flags '{flags_raw}' is not an integer") from exc
    if not 0 <= flags <= 255:
        raise ValidationFailedException("value: CAA flags must be 0..255")
    if tag.lower() not in _CAA_TAGS:
        raise ValidationFailedException(f"value: CAA tag must be one of {sorted(_CAA_TAGS)}")
    quoted = value if value.startswith('"') and value.endswith('"') else f'"{value}"'
    return f"{flags} {tag.lower()} {quoted}"


def _multi_line(raw: str, line_fn: Callable[[str], str]) -> str:
    lines = [ln.strip() for ln in raw.replace("\r\n", "\n").split("\n") if ln.strip()]
    if not lines:
        raise ValidationFailedException("value: at least one entry is required")
    return "\n".join(line_fn(ln) for ln in lines)


def validate_mx(raw: str) -> str:
    return _multi_line(raw, _validate_mx_line)


def validate_srv(raw: str) -> str:
    return _multi_line(raw, _validate_srv_line)


def validate_caa(raw: str) -> str:
    return _multi_line(raw, _validate_caa_line)
