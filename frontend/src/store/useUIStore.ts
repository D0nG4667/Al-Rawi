import { create } from "zustand";

export type HeritageTheme = "night" | "sandstone";
export type HeritagePersona = "STORYTELLER" | "ACADEMIC";
export type HeritageSiteId = "diriyah" | "hegra" | "jeddah";
export type ActiveDrawer = "archive" | "oracle" | null;

export interface HeritageSiteMetadata {
	id: HeritageSiteId;
	coordinatesLabel: string;
	cameraTarget: [number, number, number];
	unescoRef: string;
	regionEn: string;
	regionAr: string;
	titleEn: string;
	titleAr: string;
	prompts: {
		STORYTELLER: { en: string[]; ar: string[] };
		ACADEMIC: { en: string[]; ar: string[] };
	};
}

export const HERITAGE_SITES: Record<HeritageSiteId, HeritageSiteMetadata> = {
	diriyah: {
		id: "diriyah",
		coordinatesLabel: "24.7336° N, 46.5728° E",
		cameraTarget: [0, 2, 8],
		unescoRef: "UNESCO #1329 · Wadi Hanifah",
		regionEn: "Najd Plateau",
		regionAr: "هضبة نجد",
		titleEn: "At-Turaif · Ad-Dir'iyah",
		titleAr: "حي الطريف · الدرعية",
		prompts: {
			STORYTELLER: {
				en: [
					"Tell me the story of Salwa Palace and the birth of the First Saudi State.",
					"How did travelers gather in the Najdi majlis along Wadi Hanifah?",
					"What secrets lie behind the triangular furjat windows of At-Turaif?",
				],
				ar: [
					"اروِ لي حكاية قصر سلوى ونشأة الدولة السعودية الأولى.",
					"كيف كان يجتمع المسافرون في المجلس النجدي على ضفاف وادي حنيفة؟",
					"ما الأسرار الكامنة خلف نوافذ الفرجات المثلثة في حي الطريف؟",
				],
			},
			ACADEMIC: {
				en: [
					"Analyze the thermal mass and structural engineering of Najdi mud-brick walls.",
					"Compare At-Turaif defensive fortifications with UNESCO Criterion (iv) dossiers.",
					"How did palm-trunk timber roofing span monumental halls in Salwa Palace?",
				],
				ar: [
					"حلّل الكتلة الحرارية والهندسة الإنشائية لجدران الطين النجدية.",
					"قارن التحصينات الدفاعية في الطريف مع معايير ملف اليونسكو (الرابع).",
					"كيف استُخدمت جذوع النخيل لتسقيف القاعات الكبرى في قصر سلوى؟",
				],
			},
		},
	},
	hegra: {
		id: "hegra",
		coordinatesLabel: "26.7917° N, 37.9542° E",
		cameraTarget: [0, 1.5, 5],
		unescoRef: "UNESCO #1293 · AlUla",
		regionEn: "Hejaz Sandstone",
		regionAr: "حجر العلا الرملي",
		titleEn: "Al-Hijr · Hegra",
		titleAr: "الحِجر · مدائن صالح",
		prompts: {
			STORYTELLER: {
				en: [
					"Who was Lihyan son of Kuza, and why stands his tomb Qasr al-Farid unfinished?",
					"Describe the incense caravans arriving at Hegra under the desert stars.",
					"What curses and guardians were carved above the Nabataean tomb facades?",
				],
				ar: [
					"من هو لحيان بن كوزا، ولماذا بقي قصر الفريد غير مكتمل؟",
					"صف قوافل البخور والتوابل حين تصل إلى الحِجر تحت نجوم الصحراء.",
					"ما النقوش والحمايات المنحوتة فوق واجهات المقابر النبطية؟",
				],
			},
			ACADEMIC: {
				en: [
					"Examine the top-down rock-cut carving methodology of Hegra's 111 monumental tombs.",
					"What hydraulic cistern networks sustained Nabataean agriculture in AlUla?",
					"Trace the Hellenistic and Mesopotamian synthesis in Nabataean entablatures.",
				],
				ar: [
					"افحص منهجية النحت من الأعلى إلى الأسفل في مقابر الحِجر الصخرية.",
					"ما شبكات القنوات والصهاريج المائية التيعمّرت الزراعة النبطية في العلا؟",
					"تتبّع التمازج الهلنستي والرافدي في تيجان الواجهات النبطية.",
				],
			},
		},
	},
	jeddah: {
		id: "jeddah",
		coordinatesLabel: "21.4858° N, 39.1856° E",
		cameraTarget: [-2, 1.8, 6],
		unescoRef: "UNESCO #1361 · Red Sea Coast",
		regionEn: "Hejaz Littoral",
		regionAr: "ساحل البحر الأحمر",
		titleEn: "Al-Balad · Historic Jeddah",
		titleAr: "البلد · جدة التاريخية",
		prompts: {
			STORYTELLER: {
				en: [
					"Take me inside Beit Nassif as pilgrims and merchants arrive from the Red Sea.",
					"How did the carved wooden rawashin catch the sea breeze at dusk?",
					"Why was fossilized coral stone raised from the lagoon to build Al-Balad?",
				],
				ar: [
					"خذني في جولة داخل بيت نصيف مع توافد الحجاج والتجار عبر البحر الأحمر.",
					"كيف كانت الرواشين الخشبية المنحوتة تلتقط نسيم البحر عند الغروب؟",
					"لماذا شُيّدت مباني جدة التاريخية من حجر المنقبي المرجاني؟",
				],
			},
			ACADEMIC: {
				en: [
					"Evaluate the passive cross-ventilation mechanics of Hejazi rawashin mashrabiyas.",
					"Document the structural role of teakwood taklil courses in coral-stone masonry.",
					"How did 19th-century Indian Ocean trade shape Al-Balad's vertical tower houses?",
				],
				ar: [
					"قيّم آليات التهوية المتقاطعة السلبية في الرواشين والمشربيات الحجازية.",
					"وثّق الدور الإنشائي لأخشاب التكليل في البناء بالحجر المرجاني المنقبي.",
					"كيف شكّلت تجارة المحيط الهندي في القرن التاسع عشر بيوت جدة البرجية؟",
				],
			},
		},
	},
};

export interface UIState {
	activeHistoricalNode: string | null;
	cameraCoordinates: [number, number, number];
	isAIThinking: boolean;
	persona: HeritagePersona;
	theme: HeritageTheme;
	activeSite: HeritageSiteId;
	activeDrawer: ActiveDrawer;
	setFocusNode: (node: string | null, coords: [number, number, number]) => void;
	setAIThinking: (isThinking: boolean) => void;
	setPersona: (persona: HeritagePersona) => void;
	setTheme: (theme: HeritageTheme) => void;
	toggleTheme: () => void;
	setActiveSite: (siteId: HeritageSiteId) => void;
	setActiveDrawer: (drawer: ActiveDrawer) => void;
}

export const useUIStore = create<UIState>((set) => ({
	activeHistoricalNode: "diriyah",
	cameraCoordinates: [0, 2, 8],
	isAIThinking: false,
	persona: "STORYTELLER",
	theme: "night",
	activeSite: "diriyah",
	activeDrawer: null,
	setFocusNode: (node, coords) =>
		set((state) => {
			const normalized = node?.toLowerCase();
			const matchedSite: HeritageSiteId =
				normalized === "hegra" ||
				normalized === "diriyah" ||
				normalized === "jeddah"
					? normalized
					: state.activeSite;
			return {
				activeHistoricalNode: node,
				cameraCoordinates: coords,
				activeSite: matchedSite,
			};
		}),
	setAIThinking: (isThinking) => set({ isAIThinking: isThinking }),
	setPersona: (persona) => set({ persona }),
	setTheme: (theme) => set({ theme }),
	toggleTheme: () =>
		set((state) => ({
			theme: state.theme === "night" ? "sandstone" : "night",
		})),
	setActiveSite: (siteId) => {
		const site = HERITAGE_SITES[siteId];
		set({
			activeSite: siteId,
			activeHistoricalNode: siteId,
			cameraCoordinates: site.cameraTarget,
		});
	},
	setActiveDrawer: (drawer) => set({ activeDrawer: drawer }),
}));
