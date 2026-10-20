import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const lock = JSON.parse(readFileSync("rules.lock.json", "utf8"));
assert.equal(lock.schemaVersion, 1);
assert.equal(lock.baseRules.repository, "https://github.com/serrja/baseRules");
assert.match(lock.baseRules.commit, /^[0-9a-f]{40}$/);
assert.equal(lock.baseRules.entrypoint, "AGENTS.md");
const project = readFileSync("docs/project.md", "utf8");
for (const page of ["frontend", "knowledge", "versioning", "releases"]) {
  assert.ok(project.includes(`/blob/${lock.baseRules.commit}/docs/${page}.md`), `Keep ${page} linked to the selected baseRules commit`);
}
console.log("PASS: explicit full baseRules pin and matching policy links");

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
assert.equal(pkg.devDependencies["base-rules-docs"], `git+https://github.com/serrja/baseRules.git#${lock.baseRules.commit}`);
