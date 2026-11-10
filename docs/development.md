# 🧪 Development

This policy repository has no application runtime or database. Prerequisites are Git, Node 24,
npm from that runtime, Make, Bash and tar. Network is needed for initial locked setup and audits.

```bash
make help
make setup
make check
make ci-local
```

`make check` runs Markdown, relative links/anchors, rules/lock/source checks, syntax and Node
negative tests. `make test` measures tool coverage once; `make coverage` validates its fresh LCOV
report. `make build` packs a local npm archive; `make verify` checks every member, byte, version
and source identity. `make release-check` verifies that artifact without publishing.

`make ci-local` runs acceptance, coverage, build, verify, release-check and full/production dependency
audits. It records the complete plan and exits honestly on failed stages. Documentation does not
need Docker. The existing pinned Dockerfile and source-provenance helpers remain available for
optional container use; they do not authorize system installs or registry publication.

The full-commit baseRules dependency supplies native archive/source receipt checks; no helper
copy is maintained here. To refresh it, review generic source diff, update `rules.lock.json`,
its per-file identities and dependency, refresh npm lock with
`npm install --package-lock-only --ignore-scripts`, then run native and upstream checks.

Reports and bundles stay in ignored `coverage/`: commit/dirty/content identity, commands, JUnit,
LCOV and checksums. Tool coverage below 100% is advisory; failed tests, stale/corrupt evidence,
build or source identity changes fail. Policy prose itself has no runtime coverage claim.

`npm run check:upstream` uses `gh` read access for immutable generic commit/file identity. Local
checks validate installed bytes against the reviewed lock and dependency pin; they do not prove
remote availability or review. Consumer tests remain the consumer owner's responsibility.
