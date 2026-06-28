const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert");

const manifestPath = path.resolve(__dirname, "../../public/manifest.json");

console.log("Verifying PWA manifest existence and configuration...");

try {
	assert.ok(fs.existsSync(manifestPath), "PWA manifest.json does not exist!");
	console.log("✓ Success: PWA manifest.json exists.");

	const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
	assert.strictEqual(manifest.short_name, "Al-Rawi", "Short name mismatch");
	assert.strictEqual(
		manifest.display,
		"standalone",
		"Display mode must be standalone",
	);
	assert.strictEqual(manifest.start_url, "/", "Start URL must be root");
	console.log("✓ Success: PWA manifest.json keys are fully valid!");

	process.exit(0);
} catch (err) {
	console.error("✖ Failure: PWA check failed!");
	console.error(err.message);
	process.exit(1);
}
