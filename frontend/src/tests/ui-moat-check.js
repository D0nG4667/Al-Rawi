const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert");

console.log(
	"Verifying UI/UX Heritage Moat dual-theme tokens, 3D monuments, and modular workspace...",
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
const hotspotBarPath = path.resolve(
	__dirname,
	"../components/explore/SiteHotspotBar.tsx",
);
const monumentPath = path.resolve(
	__dirname,
	"../components/canvas/HeritageMonument.tsx",
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
		store.includes("HERITAGE_SITES") &&
			store.includes("toggleTheme") &&
			store.includes("hotspots"),
		"UNESCO site metadata, hotspots, or theme toggle missing from useUIStore.ts",
	);

	assert.ok(
		fs.existsSync(topBarPath) &&
			fs.existsSync(commandBarPath) &&
			fs.existsSync(manuscriptMsgPath) &&
			fs.existsSync(hotspotBarPath) &&
			fs.existsSync(monumentPath),
		"Modular Canvas-First explore or 3D monument components are missing",
	);

	console.log("✓ Success: UI/UX Heritage Moat architecture verified!");
	process.exit(0);
} catch (err) {
	console.error("✖ Failure: UI/UX Heritage Moat verification failed!");
	console.error(err.message);
	process.exit(1);
}
