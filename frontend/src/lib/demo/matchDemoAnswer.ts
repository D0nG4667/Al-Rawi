import type { ChatSource } from "@/components/explore/types";
import type { HeritagePersona, HeritageSiteId } from "@/store/useUIStore";
import type { DemoEntry } from "./demoArchive.ts";
import { toChatSource } from "./demoSources.ts";

export type DemoLocale = "en" | "ar";

export interface DemoAnswer {
	entryId: string;
	answer: string;
	sources: ChatSource[];
}

const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670]/g;

export function normalizeQuery(text: string): string {
	return text
		.normalize("NFKC")
		.toLowerCase()
		.replace(ARABIC_DIACRITICS, "")
		.replace(/[\p{P}\p{S}]/gu, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function scoreEntry(
	entry: DemoEntry,
	normalizedQuery: string,
	site: HeritageSiteId,
	persona: HeritagePersona,
): number {
	const hits = entry.keywords.filter((keyword) =>
		normalizedQuery.includes(normalizeQuery(keyword)),
	).length;
	if (hits === 0) return 0;
	return (
		hits +
		(entry.site === site ? 0.5 : 0) +
		(entry.persona === persona ? 0.25 : 0)
	);
}

function findOverview(
	entries: readonly DemoEntry[],
	site: HeritageSiteId,
	persona: HeritagePersona,
): DemoEntry {
	return (
		entries.find(
			(e) => e.prompt === null && e.site === site && e.persona === persona,
		) ??
		entries.find((e) => e.prompt === null && e.site === site) ??
		entries[0]
	);
}

export function matchDemoAnswer(
	entries: readonly DemoEntry[],
	query: string,
	site: HeritageSiteId,
	persona: HeritagePersona,
	locale: DemoLocale,
): DemoAnswer {
	const normalizedQuery = normalizeQuery(query);

	const exact = entries.find(
		(entry) =>
			entry.prompt !== null &&
			(normalizeQuery(entry.prompt.en) === normalizedQuery ||
				normalizeQuery(entry.prompt.ar) === normalizedQuery),
	);

	let best: DemoEntry | undefined = exact;
	if (!best) {
		let bestScore = 0;
		for (const entry of entries) {
			const score = scoreEntry(entry, normalizedQuery, site, persona);
			if (score > bestScore) {
				bestScore = score;
				best = entry;
			}
		}
	}

	const chosen = best ?? findOverview(entries, site, persona);
	return {
		entryId: chosen.id,
		answer: chosen.answer[locale],
		sources: chosen.sourceKeys.map((key, index) => toChatSource(key, index)),
	};
}
