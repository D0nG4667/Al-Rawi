const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert");

const enPath = path.resolve(__dirname, "../../messages/en.json");
const arPath = path.resolve(__dirname, "../../messages/ar.json");

const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
const ar = JSON.parse(fs.readFileSync(arPath, "utf8"));

function getKeys(obj, prefix = "") {
	let keys = [];
	for (const key in obj) {
		if (typeof obj[key] === "object" && obj[key] !== null) {
			keys = keys.concat(getKeys(obj[key], `${prefix}${key}.`));
		} else {
			keys.push(`${prefix}${key}`);
		}
	}
	return keys.sort();
}

const enKeys = getKeys(en);
const arKeys = getKeys(ar);

console.log("Verifying translation key parity...");
console.log(`en keys count: ${enKeys.length}`);
console.log(`ar keys count: ${arKeys.length}`);

try {
	assert.deepStrictEqual(
		enKeys,
		arKeys,
		"Translation keys for English and Arabic do not match!",
	);
	console.log("✓ Success: Translation keys match perfectly!");
	process.exit(0);
} catch (err) {
	console.error("✖ Failure: Translation keys mismatch!");
	console.error(err.message);
	process.exit(1);
}
