# Contributing

Read [AGENTS](AGENTS.md), the full baseRules pin in [rules.lock.json](rules.lock.json) and
[project policy](docs/project.md). This repository owns safe Pokerlost norms; private service
addresses, deployment mappings and personal material stay with their existing owners.

Use Node 24 and the locked documentation tools:

```bash
npm ci --ignore-scripts
npm run check
```

`markdownlint-cli` is the single Markdown CLI. It preserves the existing markdownlint rules and
includes hidden files with `--dot`, without CLI2's unpatched `braces` dependency chain.
Scoped overrides select patched `get-uri → basic-ftp`, `micromark-extension-math → katex` and
`markdownlint-cli → smol-toml` dependencies. The replacement CLI also needs
`markdownlint-cli → js-yaml@5.4.1` for [GHSA-r3ph-w7gj-g6xm](https://github.com/advisories/GHSA-r3ph-w7gj-g6xm),
an additional advisory separate from the original toolchain's four advisories.
Review upstream constraints before removing overrides. These are development tools only;
use `npm audit` and `npm audit --omit=dev` alongside the checks.

The checks cover Markdown, local relative links and full source-pin shape. Absolute URL schemes are excluded from the local link check. Verify public pinned
URLs anonymously when publishing. Review the upstream diff before updating a pin; retain old
pinned history and run affected consumer checks. No Python bootstrap or application image is needed.

Review changed paths and private-data exposure before commit. Merge only with successful current
checks; preserve a blocked PR and branch. Coverage is not applicable to this documentation repo.
