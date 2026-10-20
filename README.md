# 🧭 Pokerlost project rules

Safe Pokerlost specializations of [baseRules](https://github.com/serrja/baseRules), pinned in
[rules.lock.json](rules.lock.json). Application sources and environment configuration are separate.

Read [project policy](docs/project.md) and [contribution checks](CONTRIBUTING.md). Review the upstream diff before changing a full commit
pin; update managed references and run documentation checks in affected consumers. Never fetch
arbitrary latest policy at application/CI startup. Repository overrides state their reason/scope.

License: [MIT](LICENSE) for these original normative documents. This does not change the license
or visibility of any consuming repository or user content.

## Development

Run `make help`, `make version` and `make ci-local` with Docker/Buildx and Make.
See [development](docs/development.md), [versioning](docs/versioning.md),
[releases](docs/releases.md) and [changelog](CHANGELOG.md).
