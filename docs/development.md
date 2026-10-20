# Development

This repository contains safe Pokerlost policy. It has no application runtime or database.
Prerequisites are Git, Make, Docker with Buildx and a POSIX shell.

```bash
make help
make version
make ci-local
```

`make check` runs Markdown, relative-link and rules-contract checks. `make test` runs the native
Node contract suite once; `make coverage` validates its fresh LCOV report. `make build` uses npm
pack; `make verify` checks archive members, bytes, metadata and source identity. `make release-check`
checks the same built artifact without publishing. All five stages form `make ci-local`.

A locked tools image uses a full-commit Git dependency on baseRules for the native Node bundle
helper. No helper copy is maintained here. Updating it requires reviewing the baseRules diff,
updating `rules.lock.json` and the Git dependency together, then refreshing the npm lock with
`npm install --package-lock-only --ignore-scripts` and running the full gate.

The first preparation needs network access. `make ci-local OFFLINE=1` requires the matching prepared
tools image; missing inputs are blocked. Local BuildKit cache survives runs, while tests execute
fresh. Actions API, tokens, hosted artifacts and special GitHub environment variables are not inputs.

Reports and the bundle stay in ignored `coverage/`: source commit/dirty state/content hash,
commands, tools, JUnit, LCOV and checksums. Coverage below 100% warns; failed tests, build errors,
stale/corrupt reports and changed source identity fail. No secrets or private operational data
belong in these reports or the public policy bundle.

See [versioning](versioning.md) and [releases](releases.md).
