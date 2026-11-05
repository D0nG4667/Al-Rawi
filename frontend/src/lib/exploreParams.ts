import type { HeritagePersona, HeritageSiteId } from "@/store/useUIStore";

export type RawSearchParams = Record<string, string | string[] | undefined>;

export interface ExploreParams {
	site?: HeritageSiteId;
	persona?: HeritagePersona;
	query?: string;
}

export const MAX_QUERY_LENGTH = 300;

const SITE_IDS: readonly string[] = ["diriyah", "hegra", "jeddah"];
const PERSONAS: readonly string[] = ["STORYTELLER", "ACADEMIC"];

function firstValue(value: string | string[] | undefined): string | undefined {
	return Array.isArray(value) ? value[0] : value;
}

/** Validates `/explore` deep-link params; unknown values are dropped. */
export function parseExploreParams(raw: RawSearchParams): ExploreParams {
	const result: ExploreParams = {};

	const site = firstValue(raw.site)?.toLowerCase();
	if (site && SITE_IDS.includes(site)) result.site = site as HeritageSiteId;

	const persona = firstValue(raw.persona)?.toUpperCase();
	if (persona && PERSONAS.includes(persona)) {
		result.persona = persona as HeritagePersona;
	}

	const query = firstValue(raw.q)?.trim();
	if (query) result.query = query.slice(0, MAX_QUERY_LENGTH);

	return result;
}
