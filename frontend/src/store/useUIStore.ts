import { create } from "zustand";

export type HeritageTheme = "night" | "sandstone";
export type HeritagePersona = "STORYTELLER" | "ACADEMIC";
export type HeritageSiteId = "diriyah" | "hegra" | "jeddah";
export type ActiveDrawer = "archive" | "oracle" | null;

export interface ArchitecturalHotspot {
	id: string;
	labelEn: string;
	labelAr: string;
	detailEn: string;
	detailAr: string;
	coords: [number, number, number];
	inquiryEn: string;
	inquiryAr: string;
}

export interface HeritageSiteMetadata {
	id: HeritageSiteId;
	coordinatesLabel: string;
	cameraTarget: [number, number, number];
	unescoRef: string;
	eraEn: string;
	eraAr: string;
	regionEn: string;
	regionAr: string;
	titleEn: string;
	titleAr: string;
	hotspots: ArchitecturalHotspot[];
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
		eraEn: "1727–1818 CE · First Saudi State",
		eraAr: "١٧٢٧–١٨١٨م · الدولة السعودية الأولى",
		regionEn: "Najd Plateau",
		regionAr: "هضبة نجد",
		titleEn: "At-Turaif · Ad-Dir'iyah",
		titleAr: "حي الطريف · الدرعية",
		hotspots: [
			{
				id: "salwa-keep",
				labelEn: "Salwa Palace Keep",
				labelAr: "قصر سلوى الحصين",
				detailEn: "Seven-unit royal adobe complex & open sky courtyard",
				detailAr: "مجمع ملكي من سبع وحدات طينية وفناء سماوي مفتوح",
				coords: [0, 2.5, 6.2],
				inquiryEn:
					"Explain the architectural layout and governance role of Salwa Palace in At-Turaif.",
				inquiryAr:
					"اشرح التخطيط المعماري والدور السيادي لقصر سلوى في حي الطريف.",
			},
			{
				id: "furjat-vents",
				labelEn: "Najdi Furjat Vents",
				labelAr: "فرجات التهوية المثلثة",
				detailEn: "Stepped geometric apertures filtering desert glare",
				detailAr: "فتحات هندسية متدرجة لكسر وهج الشمس وتلطيف الهواء",
				coords: [2.5, 1.8, 5.6],
				inquiryEn:
					"How do the triangular furjat perforations regulate light and airflow in Najdi architecture?",
				inquiryAr:
					"كيف تنظّم فتحات الفرجات المثلثة الإضاءة وتدفق الهواء في العمارة النجدية؟",
			},
			{
				id: "shurfat-crown",
				labelEn: "Shurfat Battlements",
				labelAr: "شرفات الذروة المسننة",
				detailEn: "Crenellated mud-brick parapet crowns lined in gypsum",
				detailAr: "تيجان الجدران المسننة المزينة بالجص الأبيض فوق الطين",
				coords: [-2.4, 2.2, 5.8],
				inquiryEn:
					"What is the structural and symbolic role of shurfat battlements in Diriyah?",
				inquiryAr:
					"ما الدور الإنشائي والرمزي لشرفات الذروة المسننة في مباني الدرعية؟",
			},
		],
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
		eraEn: "1st Century BCE – 1st Century CE · Nabataean Kingdom",
		eraAr: "القرن ١ ق.م – ١ م · المملكة النبطية",
		regionEn: "Hejaz Sandstone",
		regionAr: "حجر العلا الرملي",
		titleEn: "Al-Hijr · Hegra",
		titleAr: "الحِجر · مدائن صالح",
		hotspots: [
			{
				id: "qasr-al-farid",
				labelEn: "Qasr al-Farid Monolith",
				labelAr: "واجهة قصر الفريد",
				detailEn: "Four-pilaster unfinished tomb of Lihyan son of Kuza",
				detailAr: "الواجهة الصخرية ذات الأعمدة الأربعة لمقبرة لحيان بن كوزا",
				coords: [0, 1.7, 5.2],
				inquiryEn:
					"Why does Qasr al-Farid have four pilasters instead of two, and why was its base left unfinished?",
				inquiryAr:
					"لماذا يضم قصر الفريد أربعة أعمدة في واجهته، ولماذا تُركت قاعدته غير مكتملة؟",
			},
			{
				id: "crowstep-crest",
				labelEn: "Assyrian Crowsteps",
				labelAr: "الشرفات المدرّجة النبطية",
				detailEn: "Opposing five-stepped sandstone crest above the entablature",
				detailAr: "المدرجات الصخرية المتقابلة التي تعلو إفريز المقبرة النبطية",
				coords: [1.9, 2.6, 4.9],
				inquiryEn:
					"Trace the Near Eastern origin of the stepped crowstep motif crowning Hegra's tombs.",
				inquiryAr:
					"تتبّع الأصول المعمارية للشرفات المدرجة التي تتوّج واجهات مقابر الحِجر.",
			},
			{
				id: "epigraphic-plaque",
				labelEn: "Aramaic Legal Inscription",
				labelAr: "لوح النقش النبطي القانوني",
				detailEn:
					"Carved burial charter invoking Dushara against tomb violators",
				detailAr: "وثيقة الدفن المنحوتة بالخط النبطي لحماية المقبرة قانونياً",
				coords: [-1.8, 1.3, 4.8],
				inquiryEn:
					"What legal clauses and fines are recorded in the Nabataean Aramaic inscriptions at Hegra?",
				inquiryAr:
					"ما البنود القانونية والغرامات المسجلة في النقوش النبطية فوق مداخل مقابر الحِجر؟",
			},
		],
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
					"ما شبكات القنوات والصهاريج المائية التي عمّرت الزراعة النبطية في العلا؟",
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
		eraEn: "7th–19th Century CE · Maritime Gate to Makkah",
		eraAr: "القرن ٧–١٩م · بوابة مكة البحرية",
		regionEn: "Hejaz Littoral",
		regionAr: "ساحل البحر الأحمر",
		titleEn: "Al-Balad · Historic Jeddah",
		titleAr: "البلد · جدة التاريخية",
		hotspots: [
			{
				id: "rawashin-bay",
				labelEn: "Teakwood Rawashin",
				labelAr: "الرواشين الخشبية المشربية",
				detailEn: "Cantilevered latticework bays capturing Red Sea breezes",
				detailAr: "شرفات خشبية بارزة تلتقط نسيم البحر وتوفر الخصوصية والظل",
				coords: [0, 2.1, 5.7],
				inquiryEn:
					"How do the cantilevered rawashin lattices cool Historic Jeddah's multi-story homes?",
				inquiryAr:
					"كيف تعمل الرواشين الخشبية البارزة على تبريد البيوت البرجية في جدة التاريخية؟",
			},
			{
				id: "manqabi-coral",
				labelEn: "Manqabi Coral Masonry",
				labelAr: "بناء الحجر المرجاني المنقبي",
				detailEn: "Porous fossilized lagoon coral bound with lime plaster",
				detailAr:
					"حجر المنقبي المرجاني المسامي المستخرج من البحر والمكسو بالنورة",
				coords: [-2.1, 1.4, 5.5],
				inquiryEn:
					"Why was fossilized Manqabi coral stone ideal for Jeddah's humid Red Sea climate?",
				inquiryAr:
					"لماذا كان حجر المنقبي المرجاني مثالياً لمقاومة رطوبة ومناخ ساحل البحر الأحمر؟",
			},
			{
				id: "taklil-Courses",
				labelEn: "Taklil Timber Tie-Beams",
				labelAr: "أحزمة التكليل الخشبية",
				detailEn: "Horizontal Java teak beams distributing vertical wall loads",
				detailAr:
					"عوارض خشب التيك الأفقية التي توزع الأحمال في الجدران المرجانية",
				coords: [2.1, 2.3, 5.6],
				inquiryEn:
					"Explain how horizontal taklil timber courses prevent structural settling in Al-Balad towers.",
				inquiryAr:
					"اشرح كيف تمنع أحزمة التكليل الخشبية التصدعات والهبوط الإنشائي في أبراج البلد.",
			},
		],
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
