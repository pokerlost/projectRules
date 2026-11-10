import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { digest, blobSha, pages } from "./policy-contract.mjs";

try {
  const { baseRules } = JSON.parse(readFileSync("rules.lock.json", "utf8"));
  for (const path of pages) {
    const file = JSON.parse(execFileSync("gh", ["api", `repos/serrja/baseRules/contents/${path}?ref=${baseRules.commit}`], { encoding: "utf8" }));
    assert.equal(file.type, "file");
    assert.equal(file.path, path);
    const bytes = Buffer.from(file.content, "base64");
    assert.equal(file.sha, baseRules.files[path].blobSha, `${path}: remote blob differs`);
    assert.equal(blobSha(bytes), file.sha);
    assert.equal(digest(bytes), baseRules.files[path].sha256, `${path}: remote bytes differ`);
  }
  console.log(`PASS: ${pages.length} pinned remote source files`);
} catch (error) {
  console.error(`Upstream verification failed: ${error.message}`);
  process.exitCode = 1;
}
