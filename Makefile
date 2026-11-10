.DEFAULT_GOAL := help
.PHONY: help setup version check lint format-check typecheck test acceptance coverage source build verify release-check test-integration ci-local
help:
	@printf '%s\n' 'Node 24: make setup; make check; make ci-local' \
	  'check: Markdown, links, locks, source identity, examples, syntax and contract tests' \
	  'ci-local: acceptance, coverage, npm bundle verification and dependency audits' \
	  'Docker is optional; no npm registry publication or deployment'
setup:
	npm ci --ignore-scripts
version:
	npm run version:show
check: acceptance
lint:
	npm run check
format-check:
	npm run check:markdown
typecheck:
	npm run check:syntax
test test-integration:
	npm test
acceptance:
	npm run acceptance
coverage:
	npm run coverage
source:
	bash docker/source_identity.sh
build: source
	npm run build
verify:
	npm run verify
release-check:
	npm run release:check
ci-local:
	node scripts/ci-local.mjs
