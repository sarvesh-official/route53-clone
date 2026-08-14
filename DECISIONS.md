# Architectural Decisions

A running log of non-obvious choices made while building the Route 53 clone.
Each entry: **decision · rationale · tradeoff**.

## Phase 1 — Scaffold + tooling

### 1. Cloudscape Design System as the primary UI kit

**Decision**: Build the UI on `@cloudscape-design/components`, the open-source
design system AWS publishes for their own console.
**Rationale**: Highest-leverage path to "looks like Route 53." The tables,
forms, modals, breadcrumbs, and top navigation are the real components AWS
uses internally, not approximations. Re-implementing AWS chrome with Tailwind
would burn time on visual minutiae.
**Tradeoff**: Cloudscape components are client-only, so every interactive page
needs a `'use client'` boundary. Acceptable in an App Router project where
data fetching is delegated to TanStack Query anyway.

### 2. Next.js 16 + React 19

**Decision**: Use the latest Next.js (16.3) with Turbopack as the default
bundler and React 19.
**Rationale**: `create-next-app` defaults. Keeps the door open to React 19
features like `use()` and Server Actions if needed.
**Tradeoff**: Cloudscape's bundle is CommonJS in places, which can surface
interop warnings under Turbopack. Not blocking, but worth monitoring.

### 3. SQLite via SQLAlchemy 2.x + Alembic

**Decision**: Use SQLAlchemy 2.x ORM with Alembic for schema migrations.
**Rationale**: Alembic gives a real migration history. Even though the scope
is a demo console, having migrations means schema changes are reproducible
and the production deploy on Render stays consistent with local development.
**Tradeoff**: Alembic adds a small amount of ceremony (revision files,
upgrade/downgrade boilerplate) compared to `Base.metadata.create_all()`.
Worth it for the audit trail.

### 4. Mock authentication with bcrypt + opaque session tokens

**Decision**: Issue an opaque random token from `/api/auth/login`, store
sessions server-side in a `user_sessions` table, validate with a
`get_current_user` dependency. No JWT, no refresh flow.
**Rationale**: The spec calls auth "mocked." A simple bearer-token flow is
enough to exercise protected routes. Server-side sessions are revocable,
unlike stateless JWT.
**Tradeoff**: Every authenticated request does a DB read for the session row.
Acceptable at this scale. A cache would be the first optimisation if needed.

### 5. TanStack Query for server state

**Decision**: Use `@tanstack/react-query` for all server state. No Redux or
Zustand.
**Rationale**: The app is CRUD-heavy with list/detail/mutation patterns.
TanStack Query handles caching, invalidation, loading/error states, and
optimistic updates out of the box. Adding Redux would duplicate what Query
already does.
**Tradeoff**: Query keys must be managed carefully to avoid stale data.
Mutation hooks must invalidate the right list keys after writes.

## Phase 2 — Backend core

### 6. Opaque server-side session tokens (no JWT)

**Decision**: `/api/auth/login` mints a random URL-safe token, persists a row
in `user_sessions` with `expires_at`, and the `get_current_user` dependency
validates by lookup.
**Rationale**: Simplest scheme that supports revocation and matches the "mock
auth" scope. Skipping JWT dodges the key-rotation and refresh-token surface.
**Tradeoff**: No token rotation, no sliding expiry window. A session is valid
until it expires or the user logs out.

### 7. bcrypt for password hashing

**Decision**: Use bcrypt for password hashing via `app/core/security.py`.
**Rationale**: Industry standard, slow enough to resist brute force, built
into Python via the `bcrypt` package.
**Tradeoff**: bcrypt has a 72-byte password limit. Not a problem for this
demo, but worth noting for production.

### 8. Layered architecture: routers → services → repositories → models

**Decision**: Four-layer separation. Routers parse HTTP, services own
business logic and commits, repositories are the sole DB-access layer,
models define ORM tables.
**Rationale**: Nothing skips layers. Routers stay thin, services stay
testable without HTTP, repositories centralise query logic.
**Tradeoff**: More files than a flat structure. The indirection pays off the
moment a second consumer (CLI, test, or future router) needs the same logic.

### 9. Custom exception hierarchy with global handlers

**Decision**: `app/core/exceptions.py` defines `NotFoundException`,
`ConflictException`, `BadRequestException`, `ValidationFailedException`,
`UnauthorizedException`, `ForbiddenException`. Each maps to an HTTP status
code. Global handlers in `main.py` catch them all.
**Rationale**: Services raise domain errors without knowing about HTTP. The
global handler shapes the response envelope.
**Tradeoff**: The error envelope shape is `{"error": {"code", "message",
"details"}}` for custom errors but Pydantic's 422 shape differs slightly.
Both are handled, but the shapes aren't identical.

### 10. Pydantic v2 for request/response validation

**Decision**: Use Pydantic v2 schemas with `model_config` for request
validation and response serialisation.
**Rationale**: Pydantic v2 is fast, type-safe, and integrates natively with
FastAPI. The `Create`/`Update`/`Read` split keeps request and response shapes
explicit.
**Tradeoff**: Pydantic v2's API differs from v1 in several places
(`model_validate` vs `parse_obj`, `model_config` vs `Config`), which can
trip up developers familiar with v1.

## Phase 3 — Hosted zones backend

### 11. Composite unique constraint `(created_by, name, type)`

**Decision**: A user can own only one PUBLIC `example.com.` zone, but two
different users can both own one.
**Rationale**: Mirrors how Route 53 treats AWS accounts as the isolation
boundary. Supports multi-user expansion without a data migration.
**Tradeoff**: The DB constraint catches duplicates, but the service layer
raises a friendlier 409 first. Belt-and-suspenders.

### 12. Auto-created NS + SOA records on zone creation

**Decision**: `zone_bootstrap.py` writes apex NS and SOA records via the
repository when a zone is created.
**Rationale**: Route 53 does this automatically. Showing NS and SOA in the
records table from the start makes the clone feel real.
**Tradeoff**: SOA bypasses the records service validator (SOA isn't in the
registry and shouldn't be user-creatable). Two write paths exist for
`dns_records`, but the bootstrap path is one short file.

### 13. Route 53-style IDs

**Decision**: Zone IDs are `Z` + 20 base32 characters. Record IDs are `R` +
20 base32 characters.
**Rationale**: Matches the format AWS uses (`Z1234567890ABC...`). Makes the
URLs and table rows look authentic.
**Tradeoff**: The ID generator is custom (`core/ids.py`). A UUID would be
simpler but wouldn't match the Route 53 aesthetic.

## Phase 4 — Records backend

### 14. Per-record-type validator registry

**Decision**: `validators/registry.py` defines a `SPECS: dict[type,
RecordTypeSpec]` dispatch table. Each record type has its own validation
function for value, name normalisation, and apex rules.
**Rationale**: Adding a new record type is a one-line registry change plus a
single function. Keeps each validator file under 100 LOC.
**Tradeoff**: Slightly more imports to wire when reading the code. Net worth
it, record-type rules now live next to other rules of the same shape.

### 15. `CreatableRecordType` ≠ `RecordType`

**Decision**: Two TypeScript and two Pydantic literals. SOA appears in the
read literal but not the create literal.
**Rationale**: Pydantic rejects POSTing an SOA at validation time, not in the
service. The frontend's create Select cannot offer SOA. The TS compiler
enforces the distinction at the form layer.
**Tradeoff**: A small amount of duplication in the literal definitions.

### 16. 404 instead of 403 for ownership errors

**Decision**: `/api/records/{id}` returns 404 if the caller doesn't own the
parent zone.
**Rationale**: 403 would leak the existence of the record. 404 is the
existence-hiding convention, matching real AWS.
**Tradeoff**: Slightly less helpful for debugging. Correct for security.

### 17. TTL validation range (0–604800)

**Decision**: TTL must be an integer in `[0, 604800]` (1 week in seconds).
**Rationale**: Matches Route 53's actual TTL range. Prevents nonsensical
values like negative TTLs or multi-year caches.
**Tradeoff**: The upper bound is arbitrary but matches AWS. A user who wants
a longer TTL gets a clear validation error.

## Phase 5 — Frontend shell

### 18. Client-side auth gate, not Next.js middleware

**Decision**: `AppShell` reads auth status from context and redirects to
`/login` if unauthenticated.
**Rationale**: App Router middleware can't read `localStorage`. A cookie-based
session would change that, but the spec scoped auth as "mock." Pushing the
gate into middleware would have been more code, not less.
**Tradeoff**: Console pages flash a spinner on first paint before the client
confirms the session. That's the right UX cue anyway.

### 19. Single fetch call site in `client.ts`

**Decision**: `lib/api/client.ts` is the only `fetch` call site. Every
resource module (`auth.ts`, `hosted-zones.ts`, etc.) sits on top with typed
wrappers.
**Rationale**: One place to add auth headers, parse the error envelope into
`ApiError`, and normalise 204 responses. Adding a new endpoint is 3–4 lines.
**Tradeoff**: Bumping the URL base or auth shape requires touching exactly one
file, which is the upside.

### 20. Cross-tab dark mode sync via `useSyncExternalStore`

**Decision**: `ThemeProvider` uses `useSyncExternalStore` to subscribe to
`storage` events, so a theme change in one tab propagates to all open tabs
instantly.
**Rationale**: Users who open the console in multiple tabs expect the theme to
stay consistent. `useSyncExternalStore` is the React 18+ way to subscribe to
external stores without tearing.
**Tradeoff**: First server render is always light (can't read localStorage on
the server). An inline script in `layout.tsx` prevents flash on the client.

## Phase 6 — Bonus features

### 21. BIND zone file import

**Decision**: Server-side parser in `bind_parser.py` handles `$ORIGIN`, `@`
shorthand, comments, and skips duplicate records.
**Rationale**: Importing a real BIND zone file is the fastest way to populate
a hosted zone with realistic data. Parsing on the backend keeps the frontend
simple (file upload or paste).
**Tradeoff**: The parser is lenient with whitespace but strict about
structure. Malformed files produce a 400 with a helpful message rather than
a partial import.

### 22. JSON and BIND export

**Decision**: `zone_export_service.py` supports both JSON and BIND format
export for any hosted zone.
**Rationale**: JSON is useful for programmatic consumption. BIND is useful
for migrating to a real DNS server. Offering both covers the two most common
export use cases.
**Tradeoff**: The BIND writer must handle escaping and line-folding for TXT
records correctly. The JSON export is straightforward.

### 23. Dark mode with localStorage + `applyMode`

**Decision**: `ThemeProvider` reads `localStorage`, calls Cloudscape's
`applyMode(Mode.Dark | Mode.Light)`, and the top-nav exposes a toggle.
**Rationale**: Cloudscape's design tokens already support dark mode
end-to-end. This is the cheapest "looks polished" win.
**Tradeoff**: First paint is always light theme. An inline script mitigates
the flash, but a sub-100ms flicker is possible on slow connections.

### 24. Keyboard shortcuts (`c`, `/`, `r`)

**Decision**: `c` opens the create modal, `/` focuses the search bar, `r`
refreshes the current query. Suppressed while typing in inputs.
**Rationale**: Power users expect keyboard shortcuts in a console app. Route
53 itself doesn't have these, but they make the clone feel responsive.
**Tradeoff**: The shortcuts are global, so they must be carefully suppressed
in input/textarea fields to avoid intercepting normal typing.

### 25. Bulk operations with confirmation modals

**Decision**: Multi-select on both the hosted-zones and records tables, with
a typed-confirmation bulk delete modal that loops per-item and surfaces
individual failures.
**Rationale**: Deleting multiple zones or records one at a time is tedious.
Bulk delete with a confirmation modal matches the AWS console pattern.
**Tradeoff**: The backend `bulk.py` endpoint loops internally. A single SQL
`DELETE ... WHERE id IN (...)` would be faster, but the loop allows
per-item ownership checks and individual failure reporting.

## Phase 7 — Polish + docs

### 26. `/api/stats` endpoint instead of client-side aggregation

**Decision**: Added a dedicated `GET /api/stats` service backed by a single
`SUM` query, plus `GET /api/stats/activity` for daily record counts.
**Rationale**: Fetching all zones and summing client-side is correct up to
200 zones and quietly wrong above. A `/stats` endpoint is the right shape
and is ~40 LOC.
**Tradeoff**: One more route and invalidation key in the frontend. Both
mutation files invalidate `statsKeys.all` so the dashboard tiles refresh
after any zone or record change.

### 27. Centralised colour palette in `colors.ts`

**Decision**: `lib/theme/colors.ts` exports a single `colors` object with
`dark`, `light`, `shared`, and `aws` sections, plus a `cssVars` mapping for
CSS custom properties.
**Rationale**: Every colour used in the app should come from one file. If a
shade needs to change, it changes in one place.
**Tradeoff**: Some components define inline `const c = { ... }` objects for
convenience. These should ideally import from `colors.ts` directly, but the
inline pattern persists in a few files for readability.

### 28. Activity sparkline from real record timestamps

**Decision**: The dashboard's 7-day activity sparkline is sourced from
`dns_records.created_at` timestamps via `/api/stats/activity`, not from
random or seeded data.
**Rationale**: The chart should reflect actual user activity, not fake
numbers. Seeded records have backdated timestamps so the chart looks
populated on first run.
**Tradeoff**: A fresh database with no records shows an empty chart. The seed
script handles this by distributing timestamps across the past 7 days.

### 29. Plain `<h3>` for dashboard card titles instead of Cloudscape Header

**Decision**: The four resource cards on the dashboard (DNS management,
Availability monitoring, Traffic management, Domain registration) use a plain
`<h3 className="r53-card-title">` instead of Cloudscape's `<Header variant="h3">`.
**Rationale**: Cloudscape's `Header` component does not support `textAlign`,
and its internal class names are not stable across versions. The previous CSS
selectors targeting `awsui_root_2qdw9` and `awsui_heading_` broke when
Cloudscape updated. A plain `<h3>` with a custom `.r53-card-title` class
centers reliably and is version-independent.
**Tradeoff**: Slight visual divergence from Cloudscape's heading styling, but
the custom class matches the font size and weight closely enough that the
difference is imperceptible.
