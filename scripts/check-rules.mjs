import { checkRules } from "./policy-contract.mjs";

try {
  console.log("PASS", JSON.stringify(checkRules()));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
