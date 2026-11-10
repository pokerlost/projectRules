import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, lstatSync } from "node:fs";
import { dirname, resolve, relative, extname } from "node:path";
import { marked } from "marked";

const sha = /^[a-f0-9]{40}$/;
const sum = /^[a-f0-9]{64}$/;
export const pages = ["AGENTS.md", "LICENSE", "docs/policy.md", "docs/engineering.md", "docs/naming.md", "docs/frontend.md", "docs/knowledge.md", "docs/versioning.md", "docs/releases.md"];
export const ruleIds = ["PR-OWN-01", "PR-HTTP-01", "PR-ID-01", "PR-GATEWAY-01", "PR-CONFIG-01", "PR-RETRY-01", "PR-OBS-01", "PR-TRUST-01", "PR-ADOPT-01"];
export const digest = data => createHash("sha256").update(data).digest("hex");
export const blobSha = data => createHash("sha1").update(`blob ${Buffer.byteLength(data)}\0`).update(data).digest("hex");
const json = path => JSON.parse(readFileSync(path, "utf8"));
const keys = (value, expected, label) => assert.deepEqual(Object.keys(value).sort(), [...expected].sort(), `${label}: unexpected/missing fields`);

export function checkExamples(example) {
  keys(example, ["kind", "serviceId", "routingSource", "audience", "method", "operation", "headerName", "headers", "settings", "metricLabels", "retry"], "example");
  assert.equal(example.kind, "illustrative-not-runtime-configuration");
  assert.equal(example.serviceId, "accountsService", "Preserve example wire value");
  assert.equal(example.routingSource, "ServiceId.ACCOUNTS", "Routing must not be derived from audience");
  assert.equal(example.audience, "accountsService");
  assert.equal(example.method, "POST");
  assert.equal(example.operation, "getMe");
  assert.equal(example.headerName, "x-pokerlost-serviceId");
  assert.deepEqual(example.headers, { "x-pokerlost-serviceId": "accountsService" }, "No credentials or arbitrary header examples");
  keys(example.settings, ["timeoutSeconds", "dataDirectory"], "settings");
  assert.equal(typeof example.settings.timeoutSeconds, "number");
  assert.ok(Number.isFinite(example.settings.timeoutSeconds) && example.settings.timeoutSeconds > 0, "Finite positive timeout required");
  assert.equal(example.settings.dataDirectory, "${DATA_DIRECTORY}", "No host-specific path");
  assert.deepEqual(example.metricLabels, { service: "accountsService", operation: "getMe", status: "200", environment: "local" }, "Bounded labels only");
  assert.deepEqual(example.retry, { owner: "sdk", attempts: 1, idempotency: "not-established" }, "No automatic retries without established idempotency");
}

function markdownFiles(root, dir = root) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules", "coverage", ".serena", ".agents", ".aws", ".codex"].includes(entry.name)) continue;
    const path = resolve(dir, entry.name);
    assert.ok(!entry.isSymbolicLink(), `Unsupported source symlink: ${relative(root, path)}`);
    if (entry.isDirectory()) files.push(...markdownFiles(root, path));
    else if (entry.isFile() && extname(path) === ".md") files.push(path);
  }
  return files;
}

function anchors(text) {
  const counts = new Map();
  return new Set(marked.lexer(text).filter(token => token.type === "heading").map(token => {
    const plain = marked.parseInline(token.text).replace(/<[^>]*>/g, "").replace(/&amp;/g, "&");
    const base = plain.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu, "").replace(/ /g, "-");
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    return count ? `${base}-${count}` : base;
  }));
}

export function checkLinks(root) {
  for (const path of markdownFiles(root)) {
    const tokens = marked.lexer(readFileSync(path, "utf8"));
    marked.walkTokens(tokens, token => {
      if (!["link", "image"].includes(token.type)) return;
      const href = token.href;
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return;
      const [pathname, fragment] = href.split("#");
      const target = pathname ? resolve(dirname(path), decodeURIComponent(pathname)) : path;
      assert.ok(target === root || target.startsWith(`${root}/`), `Link escapes source: ${href}`);
      assert.ok(lstatSync(target).isFile(), `Missing link target: ${href}`);
      if (fragment && extname(target) === ".md") {
        assert.ok(anchors(readFileSync(target, "utf8")).has(decodeURIComponent(fragment)), `Missing anchor: ${href}`);
      }
    });
  }
}

export function checkRules(root = process.cwd(), dependencyRoot = resolve(root, "node_modules/base-rules-docs")) {
  root = resolve(root);
  const lock = json(resolve(root, "rules.lock.json"));
  keys(lock, ["schemaVersion", "baseRules", "projectPolicy"], "rules lock");
  assert.equal(lock.schemaVersion, 1);
  const base = lock.baseRules;
  keys(base, ["repository", "commit", "entrypoint", "files"], "baseRules");
  assert.equal(base.repository, "https://github.com/serrja/baseRules");
  assert.match(base.commit, sha, "Full immutable baseRules commit required");
  assert.equal(base.entrypoint, "AGENTS.md");
  keys(base.files, pages, "baseRules files");
  for (const page of pages) {
    const identity = base.files[page];
    keys(identity, ["blobSha", "sha256"], page);
    assert.match(identity.blobSha, sha);
    assert.match(identity.sha256, sum);
    const bytes = readFileSync(resolve(dependencyRoot, page));
    assert.equal(blobSha(bytes), identity.blobSha, `${page}: installed generic blob differs`);
    assert.equal(digest(bytes), identity.sha256, `${page}: installed generic bytes differ`);
  }
  assert.match(readFileSync(resolve(root, "LICENSE"), "utf8"), /^MIT License/m);
  assert.match(readFileSync(resolve(dependencyRoot, "LICENSE"), "utf8"), /^MIT License/m);
  const pkg = json(resolve(root, "package.json"));
  const npmLock = json(resolve(root, "package-lock.json"));
  assert.equal(pkg.name, "project-rules-docs");
  assert.equal(pkg.license, "MIT");
  assert.equal(pkg.private, true, "No npm registry publication");
  assert.match(pkg.version, /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-dev\.(0|[1-9]\d*))?$/);
  assert.equal(npmLock.name, pkg.name);
  assert.equal(npmLock.version, pkg.version);
  assert.equal(npmLock.packages[""].version, pkg.version);
  const dependency = `git+https://github.com/serrja/baseRules.git#${base.commit}`;
  assert.equal(pkg.devDependencies["base-rules-docs"], dependency, "Unknown/unreviewed pin or dependency mismatch");
  assert.equal(npmLock.packages[""].devDependencies["base-rules-docs"], dependency);
  assert.ok([
    `git+ssh://git@github.com/serrja/baseRules.git#${base.commit}`,
    `git+https://github.com/serrja/baseRules.git#${base.commit}`
  ].includes(npmLock.packages["node_modules/base-rules-docs"].resolved), "npm lock source repository/commit differs");
  assert.equal(json(resolve(dependencyRoot, "package.json")).name, "base-rules-docs");
  assert.equal(json(resolve(dependencyRoot, "package.json")).license, "MIT");
  const provenance = json(resolve(root, ".github/engineering-source.json"));
  assert.equal(provenance.repository, "https://github.com/serrja/pythonTemplate");
  for (const path of ["docker/quality.mk", "docker/source_identity.sh"]) {
    assert.equal(digest(readFileSync(resolve(root, path))), provenance.files[path].sha256, `${path}: source provenance differs`);
    assert.match(provenance.files[path].revision, sha);
  }
  keys(lock.projectPolicy, ["path", "blobSha", "sha256"], "projectPolicy");
  assert.equal(lock.projectPolicy.path, "docs/project.md");
  const projectBytes = readFileSync(resolve(root, lock.projectPolicy.path));
  assert.equal(blobSha(projectBytes), lock.projectPolicy.blobSha, "Policy Git blob differs; review and refresh digest");
  assert.equal(digest(projectBytes), lock.projectPolicy.sha256, "Policy SHA-256 differs");
  const project = projectBytes.toString("utf8");
  for (const page of pages.filter(page => page.startsWith("docs/"))) {
    assert.ok(project.includes(`/blob/${base.commit}/${page}`), `${page}: keep selected generic policy link`);
  }
  assert.deepEqual([...project.matchAll(/^## .*(PR-[A-Z]+-\d+) /gm)].map(match => match[1]), ruleIds);
  for (const section of project.split(/^## /m).slice(2)) {
    for (const field of ["Applies", "MUST", "Why", "Good", "bad", "Verify", "Owner", "Exception"]) {
      assert.ok(section.includes(`**${field}:**`), `Incomplete rule: ${field}`);
    }
  }
  checkExamples(json(resolve(root, "docs/examples/policy_examples.json")));
  checkLinks(root);
  return { commit: base.commit, rules: ruleIds.length, sourceFiles: pages.length };
}
