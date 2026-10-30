const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert");

console.log(
	"Verifying UI/UX Heritage Moat dual-theme tokens and modular workspace...",
);

const globalsCssPath = path.resolve(__dirname, "../app/globals.css");
const storePath = path.resolve(__dirname, "../store/useUIStore.ts");
const topBarPath = path.resolve(
	__dirname,
	"../components/explore/ExploreTopBar.tsx",
);
const commandBarPath = path.resolve(
	__dirname,
	"../components/explore/OracleCommandBar.tsx",
);
const manuscriptMsgPath = path.resolve(
	__dirname,
	"../components/explore/ManuscriptMessage.tsx",
);

try {
	const css = fs.readFileSync(globalsCssPath, "utf8");
	assert.ok(
		css.includes('[data-theme="night"]') &&
			css.includes('[data-theme="sandstone"]'),
		"Dual heritage theme selectors missing from globals.css",
	);
	assert.ok(
		css.includes("--accent-gold") && css.includes("--accent-terracotta"),
		"Heritage color tokens missing from globals.css",
	);

	const store = fs.readFileSync(storePath, "utf8");
	assert.ok(
		store.includes("HERITAGE_SITES") && store.includes("toggleTheme"),
		"UNESCO site metadata or theme toggle missing from useUIStore.ts",
	);

	assert.ok(
		fs.existsSync(topBarPath) &&
			fs.existsSync(commandBarPath) &&
			fs.existsSync(manuscriptMsgPath),
		"Modular Canvas-First explore components are missing",
	);

	console.log("✓ Success: UI/UX Heritage Moat architecture verified!");
	process.exit(0);
} catch (err) {
	console.error("✖ Failure: UI/UX Heritage Moat verification failed!");
	console.error(err.message);
	process.exit(1);
}
