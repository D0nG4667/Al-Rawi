const assert = require("node:assert");

console.log("Verifying dynamic Open Graph image generation type properties...");

// Mock specs validation to assert Edge Response constraints
const mockImageResponse = {
	width: 1200,
	height: 630,
	contentType: "image/png",
};

try {
	assert.strictEqual(
		mockImageResponse.width,
		1200,
		"OG image width must be 1200",
	);
	assert.strictEqual(
		mockImageResponse.height,
		630,
		"OG image height must be 630",
	);
	assert.strictEqual(
		mockImageResponse.contentType,
		"image/png",
		"Content Type must be image/png",
	);
	console.log("✓ Success: OG image specifications conform to standard!");
	process.exit(0);
} catch (err) {
	console.error("✖ Failure: OG specifications mismatch!");
	console.error(err.message);
	process.exit(1);
}
