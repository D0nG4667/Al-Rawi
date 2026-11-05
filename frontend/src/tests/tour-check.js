const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { TOUR_STEPS, TOUR_UI_KEYS } = require("../lib/tourSteps.ts");

console.log("Verifying guided tour steps, anchors and translations...");

const componentsDir = path.resolve(__dirname, "../components");
const readAll = (dir) =>
	fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
		const full = path.join(dir, d.name);
		if (d.isDirectory()) return readAll(full);
		return full.endsWith(".tsx") ? [fs.readFileSync(full, "utf8")] : [];
	});
const componentSource = readAll(componentsDir).join("\n");
const en = JSON.parse(
	fs.readFileSync(path.resolve(__dirname, "../../messages/en.json"), "utf8"),
);
const ar = JSON.parse(
	fs.readFileSync(path.resolve(__dirname, "../../messages/ar.json"), "utf8"),
);

try {
	assert.strictEqual(TOUR_STEPS.length, 4, "Tour must have exactly 4 steps");
	for (const step of TOUR_STEPS) {
		assert.ok(
			componentSource.includes(`"${step.anchor}"`),
			`No component declares data-tour anchor "${step.anchor}"`,
		);
		for (const key of [step.titleKey, step.bodyKey]) {
			assert.ok(en.Tour?.[key], `en Tour.${key} missing`);
			assert.ok(ar.Tour?.[key], `ar Tour.${key} missing`);
		}
	}
	for (const key of TOUR_UI_KEYS) {
		assert.ok(en.Tour?.[key], `en Tour.${key} missing`);
		assert.ok(ar.Tour?.[key], `ar Tour.${key} missing`);
	}
	console.log("✓ Success: Guided tour verified!");
	process.exit(0);
} catch (err) {
	console.error("✗ Failure: Guided tour check failed!");
	console.error(err.message);
	process.exit(1);
}
