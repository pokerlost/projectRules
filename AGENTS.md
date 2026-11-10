# Pokerlost rules

Read the exact generic source in [rules.lock.json](rules.lock.json), then
[project policy](docs/project.md), then the target repository's local contract. Explicit owner
instructions and effective permissions remain authoritative. Links specify reading order,
not an automatic loader or permission grant.

Keep this repository ACTIVE and public-safe: normative rules, adoption, synthetic examples,
locks and validation only. Never add a private service catalog, real endpoints, credentials,
deployment access or personal material. Preserve existing historical consumer links.

Use Node 24: `npm ci --ignore-scripts`, `make check`, `make ci-local`. A deliberate policy edit
also refreshes its declared digest with `node scripts/update-policy-digest.mjs` after review.
`npm run check:upstream` verifies remote generic source identity separately. Do not claim consumer
semantics or published delivery from local fixture checks. See [CONTRIBUTING](CONTRIBUTING.md).
