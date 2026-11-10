# 📦 Releases

Follow the pinned [generic release policy](https://github.com/serrja/baseRules/blob/8434509933feaa71ba312f8d02caad7362766d5a/docs/releases.md)
and [version mapping](versioning.md). This ACTIVE bundle participates in dev/main GitHub Releases;
it is not published to npm registry. Release permission is separate from production deployment.

Every new dev/main push, including docs-only, requires successful native checks, immutable exact
source-event SHA, native archive metadata, checksums and GitHub Release readback. Dev is prerelease
and not latest; main is stable. Permanent branches remain protected. Promotion is working → test
→ dev → main, preserving ancestry between permanent branches and required reviews/checks.

The local gate verifies this bundle and its source identity. The docs workflow calls the reviewed
[shared release provider](https://github.com/pokerlost/.github/blob/637ff1b505b0b9fb54847d46927a9596b1ebc967/docs/release_protocol.md)
at `637ff1b505b0b9fb54847d46927a9596b1ebc967` with the native npm adapter. It validates the original
push run and successful documentation gate before allocation; no lifecycle script runs with its
write token. Passing local checks or a Git tag is not a released bundle.
Do not manufacture release evidence, dispatch a different source as retry, rewrite tags or bypass
protections. Actual producer/caller status belongs in PR and coordinator handoff, not a source journal.

After release, verify peeled tag SHA, source-event identity, prerelease/latest flag, internal npm
version and asset digests. Recover partial events through the original event record; conflicts fail.
Consumers receive actual producer commit/tag/digest, changed rule IDs, compatibility and commands.
They update only their own reviewed pins and acknowledge verification. Unreachable/unpublished pins
remain BLOCKED, while existing historical links retain their meaning.
