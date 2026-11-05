const assert = require("node:assert");
const {
	parseExploreParams,
	MAX_QUERY_LENGTH,
} = require("../lib/exploreParams.ts");

console.log(
	"Verifying geofencing boundaries and persona state configurations...",
);

const HEGRA_BOUNDS = {
	minLat: 26.78,
	maxLat: 26.82,
	minLng: 37.94,
	maxLng: 37.98,
};

function verifyGeofence(latitude, longitude) {
	return (
		latitude >= HEGRA_BOUNDS.minLat &&
		latitude <= HEGRA_BOUNDS.maxLat &&
		longitude >= HEGRA_BOUNDS.minLng &&
		longitude <= HEGRA_BOUNDS.maxLng
	);
}

try {
	// Test case 1: Coordinate inside Hegra
	assert.strictEqual(
		verifyGeofence(26.8, 37.96),
		true,
		"Coordinate inside Hegra boundary failed",
	);

	// Test case 2: Coordinate outside Hegra
	assert.strictEqual(
		verifyGeofence(27.0, 38.0),
		false,
		"Coordinate outside Hegra boundary should fail",
	);

	assert.deepStrictEqual(
		parseExploreParams({
			site: "hegra",
			persona: "academic",
			q: "  Who built it?  ",
		}),
		{ site: "hegra", persona: "ACADEMIC", query: "Who built it?" },
		"Valid deep-link params are normalised",
	);
	assert.deepStrictEqual(
		parseExploreParams({ site: "petra", persona: "pirate", q: "   " }),
		{},
		"Invalid deep-link params are ignored",
	);
	assert.deepStrictEqual(
		parseExploreParams({ site: ["jeddah", "hegra"] }),
		{ site: "jeddah" },
		"Repeated params use the first value",
	);
	assert.strictEqual(
		parseExploreParams({ q: "x".repeat(500) }).query.length,
		MAX_QUERY_LENGTH,
		"Query is capped",
	);
	console.log("✓ Success: Explore deep-link parsing verified!");

	console.log("✓ Success: Geolocation geofencing math checks pass!");
	process.exit(0);
} catch (err) {
	console.error("✖ Failure: Landing check failed!");
	console.error(err.message);
	process.exit(1);
}
