import { readFileSync, writeFileSync } from "node:fs";
import { blobSha, digest } from "./policy-contract.mjs";

const lock = JSON.parse(readFileSync("rules.lock.json", "utf8"));
const bytes = readFileSync("docs/project.md");
lock.projectPolicy = { path: "docs/project.md", blobSha: blobSha(bytes), sha256: digest(bytes) };
writeFileSync("rules.lock.json", `${JSON.stringify(lock, null, 2)}\n`);
console.log("Policy digest refreshed; review the diff and run make check.");
