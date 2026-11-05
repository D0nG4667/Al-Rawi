import type { ChatSource } from "@/components/explore/types";

export type DemoSourceKey = "unesco-1329" | "unesco-1293" | "unesco-1361";

export interface DemoSource {
	key: DemoSourceKey;
	title: string;
	url: string;
	/** Paraphrased summary of the UNESCO listing — never a quotation. */
	summary: string;
}

export const DEMO_SOURCES: Readonly<Record<DemoSourceKey, DemoSource>> = {
	"unesco-1329": {
		key: "unesco-1329",
		title:
			"UNESCO World Heritage List · At-Turaif District in ad-Dir'iyah (ref. 1329, inscribed 2010)",
		url: "https://whc.unesco.org/en/list/1329",
		summary:
			"Summary of the UNESCO listing: founded in the 15th century on the edge of Wadi Hanifah, At-Turaif was the first capital of the Saudi dynasty. It is an outstanding example of the Najdi architectural style, with mud-brick palaces and an urban ensemble set within a desert oasis. Inscribed under criteria (iv), (v) and (vi).",
	},
	"unesco-1293": {
		key: "unesco-1293",
		title:
			"UNESCO World Heritage List · Hegra Archaeological Site (al-Hijr / Madâin Sâlih) (ref. 1293, inscribed 2008)",
		url: "https://whc.unesco.org/en/list/1293",
		summary:
			"Summary of the UNESCO listing: Hegra is the largest conserved site of the Nabataean civilisation south of Petra. It contains 111 monumental tombs dating from the 1st century BC to the 1st century AD, many with decorated facades, together with wells and inscriptions. It was Saudi Arabia's first World Heritage site. Inscribed under criteria (ii) and (iii).",
	},
	"unesco-1361": {
		key: "unesco-1361",
		title:
			"UNESCO World Heritage List · Historic Jeddah, the Gate to Makkah (ref. 1361, inscribed 2014)",
		url: "https://whc.unesco.org/en/list/1361",
		summary:
			"Summary of the UNESCO listing: on the eastern shore of the Red Sea, Historic Jeddah was from the 7th century a major port for Indian Ocean trade routes and the gateway for pilgrims arriving by sea for Makkah. It is known for the tower houses built by its mercantile elites in the late 19th century, combining coral-stone construction with large wooden rawashin. Inscribed under criteria (ii), (iv) and (vi).",
	},
};

export function toChatSource(key: DemoSourceKey, index: number): ChatSource {
	const source = DEMO_SOURCES[key];
	return {
		id: `demo-${key}-${index}`,
		snippet: source.summary,
		metadata: { source: source.title, url: source.url, origin: "demo" },
	};
}
