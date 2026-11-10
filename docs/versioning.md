# 📦 Versioning

`package.json` owns this policy bundle's native SemVer intent; npm lock metadata must match.
baseRules pin, HTTP schemas, bridge contracts and database revisions have independent versions.
The [generic version policy](https://github.com/serrja/baseRules/blob/8434509933feaa71ba312f8d02caad7362766d5a/docs/versioning.md)
governs compatibility. Rule IDs remain stable; tightening requirements needs consumer impact review.

GitHub tags use `vX.Y.Z-dev.N` for dev and `vX.Y.Z` for main. Native npm bundle metadata uses
`X.Y.Z-dev.N` / `X.Y.Z`; the release adapter must inject that exact value into an isolated export,
including npm lock, before pack/verification. Do not commit release-generated metadata into branches.
Never rename a prerelease archive into a stable archive. The resolver considers existing tags and
reviewed version intent, and reuses an existing allocation on event rerun. See [releases](releases.md).

Use `npm version VERSION --no-git-tag-version --ignore-scripts` only for reviewed source intent.
`make version` checks native metadata; `make ci-local` checks the archive. No npm publish is configured.
