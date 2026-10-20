# Versioning

`package.json` owns this bundle's version; npm maintains the matching lock metadata. The initial
`0.1.0` identifies this policy collection independently from baseRules, applications and charts.
The reviewed baseRules full commit and native helper dependency are inputs, not this bundle's version.

Follow the selected [compatibility and 0.x policy](https://github.com/serrja/baseRules/blob/5d01b515b5bac8457606fe37da738ee1e96368ba/docs/versioning.md).
Use native SemVer, including explicit prereleases such as `0.2.0-dev.0`. Change the metadata with
`npm version <version> --no-git-tag-version --ignore-scripts`, document compatibility in the changelog,
and check with `make version` and `make release-check`. Existing historical pins remain valid.

Use an annotated `v<version>` for the single bundle after clean checked main integration. There
are no independent runtime versions for individual policy pages. See [releases](releases.md).
