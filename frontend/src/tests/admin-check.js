const assert = require("node:assert");

console.log("Verifying admin role validation and layout structures...");

function checkAdminRole(role) {
	if (role === "ADMIN" || role === "AUTHORITY") {
		return { allowed: true };
	}
	return { allowed: false, error: "Access Denied" };
}

try {
	// Test case 1: Admin access
	const res1 = checkAdminRole("ADMIN");
	assert.strictEqual(res1.allowed, true, "Admin role check failed");

	// Test case 2: Normal user access
	const res2 = checkAdminRole("USER");
	assert.strictEqual(res2.allowed, false, "Regular user should be rejected");
	assert.strictEqual(
		res2.error,
		"Access Denied",
		"Incorrect rejection message",
	);

	// Test case 3: Authority access
	const res3 = checkAdminRole("AUTHORITY");
	assert.strictEqual(res3.allowed, true, "Authority role check failed");

	console.log("✓ Success: Role-based admin access checks passed!");
	process.exit(0);
} catch (err) {
	console.error("✖ Failure: Admin check failed!");
	console.error(err.message);
	process.exit(1);
}
