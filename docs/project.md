# Pokerlost policy

These rules specialize generic engineering policy for Pokerlost, without exposing a service
catalog or environment topology.

## Ownership

Python tooling flows from pythonTemplate to typerTemplate, and from pythonTemplate through
fastApiTemplate to serviceTemplate. The generic HTTP layer owns instrumentation/lifecycle;
the Pokerlost specialization owns service identity and POST operation conventions. Libraries
do not require an application scaffold. Consumers update reviewed pins/provenance explicitly.

The SDK owns the typed asynchronous call/response boundary and service identifier vocabulary.
The gateway owns HTTP service selection; platformInfra owns deployment composition, environment
upstreams, artifact compatibility and observability storage/provisioning. Nginx owns static web.
C++20 engine owns poker rules/state/validation; Python reference demos own transport/rendering.
Vue owns the website; Flutter/Dart own web gameplay presentation. Native delivery is deferred.

## HTTP contracts

Business operations use POST /lowerCamelCaseVerb with explicit operationId and snake_case Python
handler names. Infrastructure routes are separate. Use `x-pokerlost-serviceId` as the canonical
documentation spelling; HTTP field names are case-insensitive, registered values case-sensitive.
Select fixed named upstreams from trusted configuration only, reject ambiguous/unknown input
before backend I/O, and never return a SPA shell for an unknown service operation.

Routing identity is not an audience, scope or credential. Bearer credentials remain solely in
Authorization; request JSON stays pure. Backends enforce authorization and operation validity.
There is no generic caller-controlled headers map. Preserve 401/403/405 and meaningful headers.
Same-origin is the default; cross-origin preflight is a separate explicit policy. Browser
WebSocket cannot add arbitrary headers; a future realtime handshake requires its own contract.

## Observability and deploy

Use Prometheus/Grafana/Loki and a supported collector, no custom telemetry service. Keep request
IDs validated and correlated across trusted hops as JSON data, never high-cardinality labels.
Route templates/operations, statuses, service and environment are bounded labels; URLs, queries,
tokens, user/table/session IDs and private cards are not labels or captured bodies.
Use loopback for local administrative listeners, configured retention and persistent data.
Document process-level resource collection honestly when privileged host access is not approved.

Validate the whole configuration before side effects. Keep secrets out of source, artifacts
and log/cache keys. Promote tested immutable artifacts, preserve DB revisions and rollback
artifacts, and distinguish app rollback from database rollback. Local build mode is distinct
from registry publication. New destinations/ACL and production deploy need explicit approval.

## Code and public presentation

The selected [frontend policy](https://github.com/serrja/baseRules/blob/3eb6bae9ab70159e2c2635ec007f0624320eed1c/docs/frontend.md)
owns TypeScript/Vue import grouping and spacing, and native Dart style. Frontend repositories
enforce it with their locked tools. Public docs use GFM/relative links, not vault syntax.
Portfolio screenshots come from a real demo; generated banners are presentation assets only.
Do not invent business endpoints, deployments, benchmarks, employers or personal facts. Keep
resume/hh.ru unchanged unless separately requested. The selected
[knowledge policy](https://github.com/serrja/baseRules/blob/3eb6bae9ab70159e2c2635ec007f0624320eed1c/docs/knowledge.md)
owns template categories, installation and provenance.
Coverage under 100% is advisory; tests/types/builds/access/config/report errors remain failures.
