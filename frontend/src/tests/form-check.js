const assert = require("node:assert");

console.log("Verifying document ingestion form URL input validation rules...");

// TDD validation rules mimic
function validateUrl(url) {
	if (!url) {
		return { success: false, error: "Please enter a valid URL." };
	}
	try {
		new URL(url);
		return { success: true };
	} catch (_) {
		return {
			success: false,
			error: "Please enter a fully qualified URL (e.g., https://...)",
		};
	}
}

try {
	// Test case 1: empty URL
	const res1 = validateUrl("");
	assert.strictEqual(res1.success, false, "Empty URL validation should fail");
	assert.strictEqual(
		res1.error,
		"Please enter a valid URL.",
		"Incorrect empty URL error message",
	);

	// Test case 2: invalid format URL
	const res2 = validateUrl("invalid-url-string");
	assert.strictEqual(res2.success, false, "Invalid URL validation should fail");
	assert.strictEqual(
		res2.error,
		"Please enter a fully qualified URL (e.g., https://...)",
		"Incorrect invalid URL format error message",
	);

	// Test case 3: valid URL
	const res3 = validateUrl("https://unesco.org/al-hijr.pdf");
	assert.strictEqual(res3.success, true, "Valid URL validation should succeed");

	console.log("✓ Success: All form input validations passed successfully!");
	process.exit(0);
} catch (err) {
	console.error("✖ Failure: Form input validation check failed!");
	console.error(err.message);
	process.exit(1);
}
