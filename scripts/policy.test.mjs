import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { checkRules, checkExamples, checkLinks } from "./policy-contract.mjs";

const source = process.cwd();
const dependency = resolve(source, "node_modules/base-rules-docs");
const readJson = path => JSON.parse(readFileSync(path, "utf8"));
const writeJson = (path, data) => writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
const example = () => readJson(resolve(source, "docs/examples/policy_examples.json"));

function fixture(action) {
  const root = mkdtempSync(resolve(tmpdir(), "project-rules-test-"));
  try {
    for (const path of ["docs", "docker", "README.md", "CONTRIBUTING.md", "AGENTS.md", "LICENSE", "rules.lock.json", "package.json", "package-lock.json", "CHANGELOG.md", "Makefile", "Dockerfile.quality", ".github"]) {
      cpSync(resolve(source, path), resolve(root, path), { recursive: true });
    }
    action(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("complete local policy bundle verifies", () => {
  const result = checkRules();
  assert.equal(result.rules, 9);
  assert.equal(result.sourceFiles, 9);
});

const lockMutations = [
  ["short pin", d => { d.baseRules.commit = "abc123"; }],
  ["unknown full pin", d => { d.baseRules.commit = "0".repeat(40); }],
  ["wrong repository identity", d => { d.baseRules.repository = "https://github.com/example/baseRules"; }],
  ["missing generic page", d => { delete d.baseRules.files["docs/policy.md"]; }],
  ["wrong generic blob", d => { d.baseRules.files["docs/policy.md"].blobSha = "0".repeat(40); }],
  ["wrong generic bytes", d => { d.baseRules.files["docs/policy.md"].sha256 = "0".repeat(64); }],
  ["wrong project blob", d => { d.projectPolicy.blobSha = "0".repeat(40); }],
  ["wrong project digest", d => { d.projectPolicy.sha256 = "0".repeat(64); }],
  ["escaping policy path", d => { d.projectPolicy.path = "../project.md"; }],
  ["unknown lock field", d => { d.mutableLatest = true; }]
];
for (const [name, mutate] of lockMutations) {
  test(`reject ${name}`, () => fixture(root => {
    const path = resolve(root, "rules.lock.json");
    const data = readJson(path);
    mutate(data);
    writeJson(path, data);
    assert.throws(() => checkRules(root, dependency));
  }));
}

test("changed policy bytes require an intentional digest refresh", () => fixture(root => {
  writeFileSync(resolve(root, "docs/project.md"), "# Unreviewed policy\n");
  assert.throws(() => checkRules(root, dependency), /Policy Git blob differs/);
}));

test("missing policy page fails", () => fixture(root => {
  unlinkSync(resolve(root, "docs/project.md"));
  assert.throws(() => checkRules(root, dependency), /ENOENT/);
}));

test("changed vendored source helper fails provenance", () => fixture(root => {
  writeFileSync(resolve(root, "docker/source_identity.sh"), "#!/bin/sh\nexit 0\n");
  assert.throws(() => checkRules(root, dependency), /source provenance differs/);
}));

test("lock resolved to another repository fails", () => fixture(root => {
  const path = resolve(root, "package-lock.json");
  const data = readJson(path);
  data.packages["node_modules/base-rules-docs"].resolved = data.packages["node_modules/base-rules-docs"].resolved.replace("serrja/baseRules", "other/baseRules");
  writeJson(path, data);
  assert.throws(() => checkRules(root, dependency), /source repository\/commit differs/);
}));

for (const [name, href] of [["relative target", "docs/missing.md"], ["fragment", "docs/project.md#absent-anchor"], ["escape", "../outside.md"]]) {
  test(`broken ${name} fails`, () => fixture(root => {
    writeFileSync(resolve(root, "README.md"), `# Test\n\n[Broken](${href})\n`);
    assert.throws(() => checkLinks(root));
  }));
}

test("valid relative heading fragment works", () => fixture(root => {
  writeFileSync(resolve(root, "README.md"), "# Test\n\n[Section](#test)\n");
  checkLinks(root);
}));

for (const [name, mutate] of [
  ["lock version mismatch", d => { d.version = "99.0.0"; }],
  ["registry publication", d => { d.private = false; }],
  ["license mismatch", d => { d.license = "UNLICENSED"; }],
  ["package identity", d => { d.name = "other"; }]
]) {
  test(`reject ${name}`, () => fixture(root => {
    const path = resolve(root, "package.json");
    const data = readJson(path);
    mutate(data);
    writeJson(path, data);
    assert.throws(() => checkRules(root, dependency));
  }));
}

for (const [name, mutate] of [
  ["renamed wire value", d => { d.serviceId = "ACCOUNTS"; }],
  ["audience as routing", d => { d.routingSource = "audience"; }],
  ["wrong HTTP method", d => { d.method = "GET"; }],
  ["host path", d => { d.settings.dataDirectory = "/home/developer/data"; }],
  ["leaking credential", d => { d.headers.Authorization = "synthetic-forbidden-value"; }],
  ["unsupported field", d => { d.productionEndpoint = "https://example.invalid"; }],
  ["unbounded metric label", d => { d.metricLabels.session_id = "synthetic-session"; }],
  ["unsafe retry", d => { d.retry.attempts = 3; }]
]) {
  test(`reject illustrative ${name}`, () => {
    const data = example();
    mutate(data);
    assert.throws(() => checkExamples(data));
  });
}

for (const timeout of [NaN, Infinity, -Infinity, 0, -1, true, "5", null]) {
  test(`reject timeout ${String(timeout)} (${typeof timeout})`, () => {
    const data = example();
    data.settings.timeoutSeconds = timeout;
    assert.throws(() => checkExamples(data));
  });
}
