const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { DEMO_ARCHIVE } = require("../lib/demo/demoArchive.ts");
const { DEMO_SOURCES } = require("../lib/demo/demoSources.ts");
const { matchDemoAnswer } = require("../lib/demo/matchDemoAnswer.ts");

console.log("Verifying Demo Archive corpus, citations and matcher...");

const SITES = ["diriyah", "hegra", "jeddah"];
const PERSONAS = ["STORYTELLER", "ACADEMIC"];
const storeText = fs.readFileSync(
	path.resolve(__dirname, "../store/useUIStore.ts"),
	"utf8",
);

try {
	const ids = new Set(DEMO_ARCHIVE.map((e) => e.id));
	assert.strictEqual(ids.size, DEMO_ARCHIVE.length, "Duplicate demo entry ids");

	for (const site of SITES) {
		for (const persona of PERSONAS) {
			const group = DEMO_ARCHIVE.filter(
				(e) => e.site === site && e.persona === persona,
			);
			assert.ok(group.length >= 4, `${site}/${persona} needs >= 4 entries`);
			assert.strictEqual(
				group.filter((e) => e.prompt === null).length,
				1,
				`${site}/${persona} needs exactly one overview entry`,
			);
			assert.strictEqual(
				group.filter((e) => e.prompt !== null).length,
				3,
				`${site}/${persona} needs one entry per starter prompt`,
			);
		}
	}

	for (const entry of DEMO_ARCHIVE) {
		assert.ok(
			entry.answer.en.length >= 120,
			`${entry.id}: en answer too short`,
		);
		assert.ok(entry.answer.ar.length >= 80, `${entry.id}: ar answer too short`);
		assert.ok(entry.keywords.length >= 3, `${entry.id}: needs >= 3 keywords`);
		assert.ok(entry.sourceKeys.length >= 1, `${entry.id}: needs a source`);
		for (const key of entry.sourceKeys) {
			const src = DEMO_SOURCES[key];
			assert.ok(src, `${entry.id}: unknown source ${key}`);
			assert.ok(
				src.url.startsWith("https://whc.unesco.org/en/list/"),
				`${key}: source must be a UNESCO listing`,
			);
		}
		if (entry.prompt) {
			assert.ok(
				storeText.includes(entry.prompt.en),
				`${entry.id}: en prompt must match a starter prompt verbatim`,
			);
			assert.ok(
				storeText.includes(entry.prompt.ar),
				`${entry.id}: ar prompt must match a starter prompt verbatim`,
			);
		}
	}

	const withPrompt = DEMO_ARCHIVE.find((e) => e.prompt !== null);
	const exactEn = matchDemoAnswer(
		DEMO_ARCHIVE,
		withPrompt.prompt.en,
		withPrompt.site,
		withPrompt.persona,
		"en",
	);
	assert.strictEqual(exactEn.entryId, withPrompt.id, "Exact en prompt match");
	assert.strictEqual(exactEn.answer, withPrompt.answer.en);

	const exactAr = matchDemoAnswer(
		DEMO_ARCHIVE,
		withPrompt.prompt.ar,
		withPrompt.site,
		withPrompt.persona,
		"ar",
	);
	assert.strictEqual(exactAr.entryId, withPrompt.id, "Exact ar prompt match");
	assert.strictEqual(exactAr.answer, withPrompt.answer.ar);

	const keyword = matchDemoAnswer(
		DEMO_ARCHIVE,
		"why was the tomb of lihyan left unfinished?",
		"hegra",
		"STORYTELLER",
		"en",
	);
	assert.ok(keyword.entryId.startsWith("hegra-"), "Keyword match prefers site");

	const fallback = matchDemoAnswer(
		DEMO_ARCHIVE,
		"zzzz qqqq",
		"jeddah",
		"ACADEMIC",
		"en",
	);
	const overview = DEMO_ARCHIVE.find(
		(e) => e.site === "jeddah" && e.persona === "ACADEMIC" && e.prompt === null,
	);
	assert.strictEqual(
		fallback.entryId,
		overview.id,
		"Unknown query -> overview",
	);
	assert.ok(fallback.sources.length >= 1, "Fallback keeps citations");
	assert.ok(
		String(fallback.sources[0].metadata.url).includes("whc.unesco.org"),
		"ChatSource carries the UNESCO url",
	);

	console.log("✓ Success: Demo Archive corpus and matcher verified!");
	process.exit(0);
} catch (err) {
	console.error("✗ Failure: Demo Archive check failed!");
	console.error(err.message);
	process.exit(1);
}
