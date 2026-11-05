export type TourAnchor =
	| "site-teleporter"
	| "persona-pill"
	| "starter-chips"
	| "citation-chip";

export interface TourStep {
	id: "site" | "persona" | "ask" | "cite";
	anchor: TourAnchor;
	titleKey: string;
	bodyKey: string;
}

/** Bump the version suffix to re-show the tour after major UI changes. */
export const TOUR_STORAGE_KEY = "al-rawi-tour-v1";

export const TOUR_STEPS: readonly TourStep[] = [
	{
		id: "site",
		anchor: "site-teleporter",
		titleKey: "siteTitle",
		bodyKey: "siteBody",
	},
	{
		id: "persona",
		anchor: "persona-pill",
		titleKey: "personaTitle",
		bodyKey: "personaBody",
	},
	{
		id: "ask",
		anchor: "starter-chips",
		titleKey: "askTitle",
		bodyKey: "askBody",
	},
	{
		id: "cite",
		anchor: "citation-chip",
		titleKey: "citeTitle",
		bodyKey: "citeBody",
	},
];

export const TOUR_UI_KEYS: readonly string[] = [
	"stepCounter",
	"waiting",
	"next",
	"back",
	"skip",
	"finish",
	"askForMe",
	"restart",
];
