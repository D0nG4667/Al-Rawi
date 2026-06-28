const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert");

const readmePath = path.resolve(__dirname, "../../README.md");

console.log("Verifying frontend README.md documentation file...");

try {
	assert.ok(fs.existsSync(readmePath), "frontend/README.md does not exist!");
	const stat = fs.statSync(readmePath);
	assert.ok(stat.size > 100, "frontend/README.md is too short or empty!");
	console.log("✓ Success: README.md documentation verified!");
	process.exit(0);
} catch (err) {
	console.error("✖ Failure: README check failed!");
	console.error(err.message);
	process.exit(1);
}
