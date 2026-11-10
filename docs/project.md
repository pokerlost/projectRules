# 🧭 Pokerlost policy

This active bundle owns Pokerlost integration rules, without a private service registry or
deployment topology. Read the reviewed generic
[policy](https://github.com/serrja/baseRules/blob/8434509933feaa71ba312f8d02caad7362766d5a/docs/policy.md),
[engineering](https://github.com/serrja/baseRules/blob/8434509933feaa71ba312f8d02caad7362766d5a/docs/engineering.md),
[naming](https://github.com/serrja/baseRules/blob/8434509933feaa71ba312f8d02caad7362766d5a/docs/naming.md),
[frontend](https://github.com/serrja/baseRules/blob/8434509933feaa71ba312f8d02caad7362766d5a/docs/frontend.md),
[knowledge](https://github.com/serrja/baseRules/blob/8434509933feaa71ba312f8d02caad7362766d5a/docs/knowledge.md),
[versioning](https://github.com/serrja/baseRules/blob/8434509933feaa71ba312f8d02caad7362766d5a/docs/versioning.md) and
[release principles](https://github.com/serrja/baseRules/blob/8434509933feaa71ba312f8d02caad7362766d5a/docs/releases.md).
[rules.lock.json](../rules.lock.json) records their source identity.

## 📌 Using the catalog

MUST is required for the stated applicability; SHOULD permits a documented tradeoff. Exceptions
record rule ID, owning repository, reason, compatibility impact, verification and expiry/review
condition in the consumer PR. They cannot waive authorization, secrets protection or existing
public contracts. Examples are illustrative and do not announce new endpoints. See
[adoption](adoption_guide.md) for pin updates and executable example checks.

## 🧩 PR-OWN-01 — Keep contracts with their producer

**Applies:** behavior shared across Pokerlost components. **MUST:** keep ServiceId and Python
transport with the SDK, routing selection with the gateway, game invariants with the engine and
composition with infrastructure. Services own API/schema and authorization. Templates compose
source, not runtime dependencies. The website owns navigation; the gameplay client presentation.
**Why:** one authoritative producer prevents incompatible forks.

**Good:** import the SDK routing enum; **bad:** fork its service vocabulary in a consumer.
**Verify:** producer/consumer contract tests and review; distinguish READY, FOUNDATION and PLANNED
capabilities. **Owner:** contract producer and affected consumer. **Exception:** a versioned
cross-language schema or adapter, with drift tests.

## 🌐 PR-HTTP-01 — Preserve operation contracts

**Applies:** business HTTP operations. **MUST:** preserve existing POST paths, operationId, wire
fields, errors and serialized enum values. New paths use `POST /lowerCamelCaseOperation`; Python
handlers use snake_case. Keep health/metrics/static routes separate; preserve meaningful
401/403/405 and headers. **Why:** an internal rename must not break clients.

**Good:** internal `get_me` retains an existing `/getMe`; **bad:** silently replacing its path.
**Verify:** source OpenAPI diff plus provider/SDK tests; the
[routing test](https://github.com/pokerlost/pypokerlost/blob/577bc2474d69c77e78ed55e517d6adaf71ab22db/tests/test_header_routing.py)
separates operation, payload and routing. **Owner:** API producer, with SDK consumer review.
**Exception:** explicit versioned compatible transition, never cosmetic cleanup.

## 🪪 PR-ID-01 — Separate routing, audience and credentials

**Applies:** SDK/gateway/service requests. **MUST:** use registered, case-sensitive ServiceId
values under canonical documentation spelling `x-pokerlost-serviceId`; header names remain
case-insensitive. An audience identifies token recipients, a scope authority, and a routing ID
service selection. Equal strings do not make these types interchangeable. Bearer credentials
belong only in Authorization, never JSON or routing. **Why:** routing is not authorization.

**Good:** `ServiceId.ACCOUNTS` serializes as `accountsService`; **bad:** derive routing from an
audience or serialize `ACCOUNTS`. **Verify:** positive/unknown-ID tests against the
[SDK enum](https://github.com/pokerlost/pypokerlost/blob/577bc2474d69c77e78ed55e517d6adaf71ab22db/src/pypokerlost/enums/service_id.py)
and routing test. **Owner:** SDK vocabulary, gateway selection, backend authorization.
**Exception:** reviewed explicit typed mapping; no caller-controlled arbitrary headers map.

## 🚦 PR-GATEWAY-01 — Resolve only trusted upstreams

**Applies:** gateway boundaries. **MUST:** reject missing, unknown, duplicate or ambiguous service
selection before backend I/O; accepted IDs select fixed named upstreams from trusted config.
Unknown operations must not receive a SPA shell. Same-origin is the default; CORS/preflight is
an explicit separate policy. Browser WebSocket cannot set arbitrary headers; its handshake needs
a dedicated contract. **Why:** callers must not choose network destinations.

**Good:** an enum selects an allowlisted upstream; **bad:** a request header supplies its URL.
**Verify:** gateway rejection/no-I/O and method/status tests; browser preflight/handshake checks
where applicable. **Owner:** gateway; infrastructure owns actual addresses. **Exception:** a
reviewed transport/handshake preserving equivalent trust boundaries.

## ⚙️ PR-CONFIG-01 — Validate integration settings before I/O

**Applies:** component operational settings. **MUST:** validate finite positive timeouts, units,
limits and environment selection before clients/listeners open. Public examples are synthetic;
host-specific paths, secrets and production addresses stay private. Security allowlists remain
reviewed, not caller configurable. **Why:** invalid settings must fail before side effects.

**Good:** explicit timeout seconds and environment-provided data directory; **bad:** infinite
timeout or baked-in `/home/developer/...`. **Verify:** invalid-settings, finite/range and clean
local-run tests. Bundled example checks do not inspect all consumers. **Owner:** component config
owner. **Exception:** declared platform adapter with capability checks and a tested fallback.

## 🔄 PR-RETRY-01 — Assign one bounded retry owner

**Applies:** SDK/service/realtime calls. **MUST:** define deadline/cancellation ownership, bounded
attempts and idempotency before retrying side effects. Avoid independent retry layers in client,
SDK and gateway. Preserve error envelopes and Retry-After. **Why:** transport failure does not
prove that a business command failed.

**Good:** opt in for proven idempotency within one total budget; **bad:** replay a debit after
timeout without deduplication. **Verify:** cancellation, exhausted budget, transient/permanent
errors and duplicate-effect tests. The
[SDK retry tests](https://github.com/pokerlost/pypokerlost/blob/577bc2474d69c77e78ed55e517d6adaf71ab22db/tests/test_retry.py)
describe the current fixed policy, not configurable retry settings. **Owner:** producer idempotency,
SDK transport retry. **Exception:** producer deduplication contract and replay tests; no unbounded retry.

## 📊 PR-OBS-01 — Keep telemetry bounded and public-safe

**Applies:** metrics, traces and structured logs. **MUST:** validate correlation IDs across trusted
hops; metric dimensions are bounded service/environment/operation template/status. Never label
metrics with user/table/session/request IDs, raw URLs, queries or private cards. Exclude credentials
and sensitive bodies. Use supported collectors/storage, not a custom telemetry service.
**Why:** cardinality and confidentiality constrain the whole system.

**Good:** `operation=getMe,status=200`; **bad:** `session_id=...` in a metric. **Verify:** bundled
label allowlist plus consumer redaction/cardinality tests and review. Infrastructure verifies
retention, persistence and listeners. **Owner:** component emits; infrastructure provisions.
**Exception:** validated IDs in access-controlled logs/traces with retention, never metric labels.

## 🔒 PR-TRUST-01 — Preserve artifact and migration boundaries

**Applies:** integration/deployment. **MUST:** consume reviewed immutable versions, image digests
or full source pins; preserve applied DB revisions and rollback artifacts. Distinguish app rollback
from DB rollback and local build from registry publishing. Administrative listeners SHOULD bind
loopback locally. **Why:** a tested tree does not prove deployment or database downgrade support.

**Good:** composition pins a tested digest and migration compatibility; **bad:** mutable `latest`
with an untested rollback promise. **Verify:** manifest/digest, migration tests and deployment
profile. **Owner:** producer version, infrastructure composition, service migrations.
**Exception:** explicit local source-build profile; no implied registry/deploy/new ACL permission.

## 📦 PR-ADOPT-01 — Review the complete policy pin chain

**Applies:** Pokerlost policy consumers. **MUST:** adopt projectRules at a full immutable commit;
review its baseRules lock, changed rules and local overrides together. Retain historical links.
Components own native checks; organization workflows own mechanics. Follow working → test → dev
→ main and exact-event releases from the linked generic policy. **Why:** a URL is a reviewed
source, not an automatic loader or permission grant.

**Good:** update AGENTS/template pin and affected tests; **bad:** fetch `main` at startup or call
an unpublished SHA released. **Verify:** lock/link/examples here, native tests and release readback
at each consumer. **Owner:** policy producer and consumer's own coordinator. **Exception:** an
intentionally historical immutable reference with declared applicability. This repository stays ACTIVE.
