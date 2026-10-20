# Contributing

Read [AGENTS](AGENTS.md), the full baseRules pin in [rules.lock.json](rules.lock.json) and
[project policy](docs/project.md). This repository owns safe Pokerlost norms; private service
addresses, deployment mappings and personal material stay with their existing owners.

Use Node 24 and the locked documentation tools:

```bash
npm ci --ignore-scripts
npm run check
```

The checks cover Markdown, local relative links and full source-pin shape. Absolute URL schemes are excluded from the local link check. Verify public pinned
URLs anonymously when publishing. Review the upstream diff before updating a pin; retain old
pinned history and run affected consumer checks. No Python bootstrap or application image is needed.

Review changed paths and private-data exposure before commit. Merge only with successful current
checks; preserve a blocked PR and branch. Coverage is not applicable to this documentation repo.
