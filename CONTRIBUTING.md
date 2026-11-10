# 🤝 Contributing

Read [AGENTS](AGENTS.md), the reviewed generic pin in [rules.lock.json](rules.lock.json), then
[project policy](docs/project.md). This active repository owns safe Pokerlost rules and examples;
private catalogs, real endpoints, credentials and personal material stay with their owners.

## 🧪 Prepare and check

Use Git, Node 24 and the matching npm. Install the lock without lifecycle scripts:

```bash
npm ci --ignore-scripts
make check
make ci-local
npm run check:upstream
```

`make check` runs Markdown, relative link/anchor, lock/source, examples, syntax and contract tests.
`make ci-local` adds coverage, build, per-file archive verification and dependency audits; it needs
neither Docker nor services. The separate upstream check uses `gh` read access to verify pinned
public sources. A missing source or required tool fails visibly. See [development](docs/development.md).

## 📌 Change rules and pins

Keep stable IDs and record applicability, MUST/SHOULD, rationale, good/bad example, verification,
owner and exception. Separate illustrative fixtures from implemented capabilities. For policy
edits, review and run `node scripts/update-policy-digest.mjs` before checks. For generic pin updates,
review old/new upstream diff, record per-file Git blob SHA/SHA-256, update dependency and npm lock
and verify remote identity; follow [adoption](docs/adoption_guide.md). Historical links remain valid.

`markdownlint-cli` is the single Markdown CLI. Keep scoped patched dependencies until their upstream
constraints and audit are reviewed; do not run automatic force upgrades. The lock retains the native
baseRules archive checker and its source identity contract. Tests cover tool behavior and intentional
bad inputs, not the correctness of every consumer's implementation. Coverage has no 100% threshold.

## 🌿 Review and delivery

Create one lowerCamelCase working branch from current `origin/test`, then a scoped Conventional
Commit and PR into test. Inspect the full diff, staged paths, secrets, exact head SHA and required
checks/reviews before merge. Promote test → dev → main through separate ancestry-preserving PRs;
never delete or force-push permanent branches. Current owner instructions and protection gates apply.

Follow the [release contract](docs/releases.md): each new dev/main event, including docs-only, needs
checks and an exact-SHA GitHub Release. The bundle stays npm-private. An unavailable check, protection
or producer pin is BLOCKED, never an excuse to bypass review. Registry publication and production
deployment need separate authorization. Public security reports must omit sensitive details; use
GitHub's private vulnerability reporting where enabled or contact a maintainer privately first.
