# Releases

Apply the selected [release procedure](https://github.com/serrja/baseRules/blob/5d01b515b5bac8457606fe37da738ee1e96368ba/docs/releases.md).
Run `make ci-local`, review source identity and archive checksum, then review and integrate the PR
only when mandatory checks succeed. Billing-blocked checks preserve the branch and PR.

On clean checked main, inspect tag-triggered workflows before creating an annotated `v<version>`.
Push only that named tag and verify its remote object and peeled commit. Current documentation
CI listens to main and PRs only. Recheck before tagging; package publication, GitHub Releases and
deployment remain separate operations. No npm registry publication is configured.

Archive evidence under the project's ignored `coverage/`; changed metadata invalidates old
artifacts and requires a fresh build. Preserve historical refs and unrelated user data.
