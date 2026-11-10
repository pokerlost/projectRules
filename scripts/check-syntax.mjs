import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";

const files = readdirSync("scripts").filter(name => name.endsWith(".mjs"));
assert.ok(files.length > 0);
for (const name of files) execFileSync(process.execPath, ["--check", `scripts/${name}`], { stdio: "inherit" });
console.log(`PASS: ${files.length} JavaScript files parsed`);
