# 🧭 Pokerlost project rules

An ACTIVE, independently versioned bundle of Pokerlost-specific integration rules. It governs
HTTP/service identity, ownership, configuration, trust, retries and observability. Generic rules
belong to [baseRules](https://github.com/serrja/baseRules); community and reusable delivery belong
to [the organization repository](https://github.com/pokerlost/.github). Application code and
private environment configuration remain with their owners.

## 🚀 Start here

1. Read the [nine-rule catalog](docs/project.md).
2. Follow [adoption and examples](docs/adoption_guide.md) to select a reviewed immutable commit,
   inspect its [generic source lock](rules.lock.json) and update only your own consumer.
3. Run that consumer's native checks; record rule IDs and any justified exception in its PR.

Never load mutable `main`/`latest` policy during application startup. Existing historical pins
retain their meaning. This repository is retained in setup catalogs and must not be archived,
deprecated or replaced by copied policy text.

## 🧪 Verify the bundle

Use Git, Node 24 and npm. Docker is optional:

```bash
npm ci --ignore-scripts
make check
make ci-local
```

The fast gate checks Markdown, local links/anchors, source/lock/package identity, synthetic
examples and negative tests. The full gate adds a verified npm archive, measured tool coverage
and dependency audits. Rules/text are reviewed; fixture validation is not semantic enforcement
of all services. `npm run check:upstream` separately verifies the pinned generic source via `gh`.

See [CONTRIBUTING](CONTRIBUTING.md), [development](docs/development.md),
[versioning](docs/versioning.md), [releases](docs/releases.md) and [changelog](CHANGELOG.md).

## 📄 License

[MIT](LICENSE) covers this original policy text. Pinned baseRules sources retain their own MIT
attribution; no consuming repository's license, access or publication rights change.
