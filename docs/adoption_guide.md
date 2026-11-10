# 🤝 Adopt and update projectRules

Use this active bundle for Pokerlost-specific rules. baseRules owns generic engineering policy,
`.github` community defaults and reusable delivery, and components their own source/contracts.
No runtime policy fetch is required.

## 📌 Pin a reviewed source

The chain is baseRules commit in `rules.lock.json` → projectRules commit → consumer AGENTS,
template/provenance or source lock. Select a remotely reachable producer commit after reviewing
its diff/checks; preserve standard README/AGENTS filenames and existing historical references:

```bash
gh api repos/pokerlost/projectRules/commits/FULL_PROJECT_RULES_SHA --jq .sha
git diff OLD_PROJECT_RULES_SHA FULL_PROJECT_RULES_SHA -- docs/project.md rules.lock.json
```

Uppercase identifiers are placeholders, not executable SHA examples. Run the diff in a verified
projectRules clone. In the consumer, update the commit part of its old URL, retaining its path:

```text
Before: https://github.com/pokerlost/projectRules/blob/OLD_PROJECT_RULES_SHA/docs/project.md
After:  https://github.com/pokerlost/projectRules/blob/FULL_PROJECT_RULES_SHA/docs/project.md
```

Review the old/new baseRules lock too. Update managed templates/provenance through their source
composition tool, not generated `_sources` alone. The consumer PR records changed rule IDs,
old/new SHAs, compatibility, native tests and publication status. A local patch is not a published pin.

## 🧪 Reproduce checks

Prerequisites: Git, Node 24 and its npm. Documentation checks need neither Docker nor a database:

```bash
npm ci --ignore-scripts
make check
make ci-local
```

`make check` covers Markdown, relative links/anchors, lock/package/source identity, examples,
JavaScript syntax and negative tests. `make ci-local` additionally verifies measured tool coverage,
an npm archive with per-file bytes and dependency audits. No registry publication occurs.
`npm run check:upstream` separately reads pinned generic files through `gh`, checking Git blob SHA
and SHA-256; inaccessible sources fail explicitly rather than being reported as verified.

For a deliberate policy edit, review `docs/project.md`, refresh its declared digest and recheck:

```bash
node scripts/update-policy-digest.mjs
make check
```

The digest detects unsynchronized metadata; it is not a review signature. A generic pin refresh
also needs reviewed upstream digests, package dependency and npm lock changes together.

## 🧩 Verify the affected consumer

Run that repository's CONTRIBUTING commands. For HTTP consumers, review the
[SDK ServiceId](https://github.com/pokerlost/pypokerlost/blob/577bc2474d69c77e78ed55e517d6adaf71ab22db/src/pypokerlost/enums/service_id.py)
and [routing tests](https://github.com/pokerlost/pypokerlost/blob/577bc2474d69c77e78ed55e517d6adaf71ab22db/tests/test_header_routing.py)
before PR-ID-01 adoption. An audience is a separate validated type even when its string matches
`accountsService`. Never change wire values to match enum member case. For reliability, test
cancellation, deadlines and duplicate effects before enabling retries; current SDK retry settings
are fixed and opt-in.

[policy_examples.json](examples/policy_examples.json) contains synthetic illustrative headers,
operation, settings and bounded labels. Its checks reject a renamed routing value, audience-derived
routing, credentials, invalid timeout, host path and unbounded labels. Passing these fixtures
proves only these examples; real gateway/service semantics still require consumer tests and review.

## 🔄 Compatibility and exceptions

Stable rule IDs support review; tighter requirements need a consumer impact review. Wire/schema
changes need a versioned transition. Keep old immutable URLs and projectRules in setup catalogs.
Do not silently rewrite HTTP paths/errors, enum values, imports, migrations or private config.

Request an exception in the consumer PR: rule ID, applicability, reason, contract impact, owner,
tests and expiry/review condition. Example: an explicit local source-build profile for PR-TRUST-01
with provenance and no registry publication. Authorization and secret protection cannot be waived.

A release handoff includes actual commit/tag/digest, status, changed rule IDs and commands/results.
Each consumer updates its own repositories and acknowledges verified pins. Unpublished/inaccessible
artifacts remain BLOCKED. See [releases](releases.md).
