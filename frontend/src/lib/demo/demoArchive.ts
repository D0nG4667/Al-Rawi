import type { HeritagePersona, HeritageSiteId } from "@/store/useUIStore";
import type { DemoSourceKey } from "./demoSources.ts";

export interface LocalizedText {
	en: string;
	ar: string;
}

export interface DemoEntry {
	id: string;
	site: HeritageSiteId;
	persona: HeritagePersona;
	/** Exact starter prompt this entry answers, or null for the site overview. */
	prompt: LocalizedText | null;
	/** Lower-case English and Arabic terms used for fuzzy matching. */
	keywords: readonly string[];
	answer: LocalizedText;
	sourceKeys: readonly DemoSourceKey[];
}

export const DEMO_ARCHIVE: readonly DemoEntry[] = [
	{
		id: "diriyah-storyteller-overview",
		site: "diriyah",
		persona: "STORYTELLER",
		prompt: null,
		keywords: ["diriyah", "turaif", "الدرعية", "الطريف", "najdi", "نجد"],
		answer: {
			en: "### At-Turaif, Where a State Was Born\n\nOn the edge of Wadi Hanifah, palm groves meet walls of sun-dried mud brick. At-Turaif grew here from the 15th century and became the first capital of the Saudi dynasty. Its palaces, mosques and houses were raised in the Najdi style, built from the earth of the valley itself and shaped to keep out the desert heat.\n\nUNESCO inscribed At-Turaif on the World Heritage List in 2010 as an outstanding example of this architecture and of a settlement adapted to its desert oasis.",
			ar: "### حي الطريف حيث وُلدت دولة\n\nعلى حافة وادي حنيفة تلتقي بساتين النخيل بجدران من الطين المجفف تحت الشمس. نشأ حي الطريف هنا منذ القرن الخامس عشر، وصار العاصمة الأولى للأسرة السعودية. شُيّدت قصوره ومساجده وبيوته على الطراز النجدي من طين الوادي نفسه، وصُمّمت لتقي ساكنيها حرّ الصحراء.\n\nأدرجت اليونسكو حي الطريف في قائمة التراث العالمي عام ٢٠١٠ بوصفه نموذجاً استثنائياً لهذه العمارة ولمستوطنة تكيّفت مع واحتها الصحراوية.",
		},
		sourceKeys: ["unesco-1329"],
	},
	{
		id: "diriyah-storyteller-1",
		site: "diriyah",
		persona: "STORYTELLER",
		prompt: {
			en: "Tell me the story of Salwa Palace and the birth of the First Saudi State.",
			ar: "اروِ لي حكاية قصر سلوى ونشأة الدولة السعودية الأولى.",
		},
		keywords: [
			"salwa",
			"سلوى",
			"palace",
			"قصر",
			"first saudi state",
			"الدولة السعودية الأولى",
		],
		answer: {
			en: "### Salwa Palace and the First Saudi State\n\nAt the heart of At-Turaif rises Salwa Palace, the largest building of the district and the seat of power during the 18th century, when Diriyah became the capital of the First Saudi State. From here the rulers received delegations and governed a state that came to span much of the Arabian Peninsula.\n\nIts mud-brick halls, built in several phases above Wadi Hanifah, show how Najdi builders scaled up a domestic tradition into monumental architecture.",
			ar: "### قصر سلوى والدولة السعودية الأولى\n\nفي قلب حي الطريف ينهض قصر سلوى، أكبر مباني الحي ومقرّ الحكم في القرن الثامن عشر حين صارت الدرعية عاصمة الدولة السعودية الأولى. من هنا استقبل الحكّام الوفود وأداروا دولةً امتدت على مساحة واسعة من الجزيرة العربية.\n\nتكشف قاعاته الطينية التي بُنيت على مراحل كيف ارتقى البنّاؤون النجديون بتقاليد البيت إلى عمارةٍ ضخمة.",
		},
		sourceKeys: ["unesco-1329"],
	},
	{
		id: "diriyah-storyteller-2",
		site: "diriyah",
		persona: "STORYTELLER",
		prompt: {
			en: "How did travelers gather in the Najdi majlis along Wadi Hanifah?",
			ar: "كيف كان يجتمع المسافرون في المجلس النجدي على ضفاف وادي حنيفة؟",
		},
		keywords: [
			"majlis",
			"المجلس",
			"wadi hanifah",
			"وادي حنيفة",
			"travelers",
			"المسافرون",
		],
		answer: {
			en: "### Hospitality Along Wadi Hanifah\n\nWhere desert tracks descended into the palm-shaded banks of Wadi Hanifah, At-Turaif welcomed scholars, envoys and travelers into the Najdi majlis. Behind thick mud-brick walls that held the midday desert heat at bay, guests gathered in cool reception rooms roofed with palm-trunk beams and woven palm fronds.\n\nCrenellated parapets and triangular vents crowned the earthen skyline above the oasis, while inside the majlis the daily life of the 18th-century capital unfolded through counsel, learning and shared hospitality.",
			ar: "### الضيافة على ضفاف وادي حنيفة\n\nحيث تنحدر مسالك الصحراء نحو ضفاف وادي حنيفة المظلّلة بالنخيل، كان حي الطريف يستقبل العلماء والوفود والمسافرين في المجلس النجدي. وخلف جدران طينية سميكة تردّ قيظ الظهيرة، كان الضيوف يجتمعون في قاعات استقبال سُقّفت بجذوع النخيل وسعفها المنسوج.\n\nكانت الشرفات المسننة تتوّج الأفق فوق الواحة، بينما تدور في المجلس شؤون العاصمة في القرن الثامن عشر بين الشورى والعلم والضيافة العربية.",
		},
		sourceKeys: ["unesco-1329"],
	},
	{
		id: "diriyah-storyteller-3",
		site: "diriyah",
		persona: "STORYTELLER",
		prompt: {
			en: "What secrets lie behind the triangular furjat windows of At-Turaif?",
			ar: "ما الأسرار الكامنة خلف نوافذ الفرجات المثلثة في حي الطريف؟",
		},
		keywords: [
			"furjat",
			"الفرجات",
			"triangular",
			"المثلثة",
			"vents",
			"light",
			"airflow",
		],
		answer: {
			en: "### Light and Breeze Through the Furjat\n\nLook closely at the earthen mud-brick facades of At-Turaif and you will notice rhythmic tiers of small triangular vents known as furjat. Najdi builders arranged these geometric openings across the upper walls not merely as ornament, but to soften the fierce desert glare into gentle shafts of light.\n\nAs warm air rose toward the palm-trunk and palm-frond ceilings, the stepped furjat drew cooler breezes from Wadi Hanifah through the rooms while preserving the privacy of the household within.",
			ar: "### الضوء والنسيم عبر الفرجات المثلثة\n\nحين تتأمل الواجهات الطينية في حي الطريف تطالعك صفوف متناسقة من الفتحات المثلثة الصغيرة المعروفة بالفرجات. لم ينظم البنّاؤون النجديون هذه التكوينات الهندسية للزينة فحسب، بل لكسر وهج الشمس الحارقة وتحويله إلى خيوط ضوء هادئة.\n\nومع صعود الهواء الدافئ نحو الأسقف المشيّدة من جذوع النخيل وسعفها، كانت الفرجات المتدرجة تجذب النسائم اللطيفة من وادي حنيفة مع الحفاظ على خصوصية البيوت.",
		},
		sourceKeys: ["unesco-1329"],
	},
	{
		id: "diriyah-academic-overview",
		site: "diriyah",
		persona: "ACADEMIC",
		prompt: null,
		keywords: ["diriyah", "turaif", "criterion", "najdi", "الدرعية", "الطريف"],
		answer: {
			en: "### Architectural and Historical Overview of At-Turaif\n\nInscribed on the UNESCO World Heritage List in 2010 under criteria (iv), (v) and (vi), the At-Turaif District in ad-Dir'iyah was founded in the 15th century along Wadi Hanifah and served in the 18th century as the capital of the First Saudi State until its destruction in 1818 by Ottoman-Egyptian forces.\n\nThe site represents a coherent urban ensemble in the Najdi architectural style, combining monumental mud-brick palaces, mosques and defensive walls adapted to an oasis environment.",
			ar: "### نظرة معمارية وتاريخية على حي الطريف\n\nأُدرج حي الطريف في الدرعية ضمن قائمة التراث العالمي لليونسكو عام ٢٠١٠ وفق المعايير (iv) و(v) و(vi). تأسس الحي في القرن الخامس عشر على ضفاف وادي حنيفة، وغدا في القرن الثامن عشر عاصمة الدولة السعودية الأولى حتى تدميره عام ١٨١٨ على يد القوات العثمانية المصرية.\n\nيمثّل الموقع نسيجاً عمرانياً متكاملاً على الطراز النجدي يجمع بين القصور الطينية والمساجد والأسوار الدفاعية المتكيّفة مع بيئة الواحة.",
		},
		sourceKeys: ["unesco-1329"],
	},
	{
		id: "diriyah-academic-1",
		site: "diriyah",
		persona: "ACADEMIC",
		prompt: {
			en: "Analyze the thermal mass and structural engineering of Najdi mud-brick walls.",
			ar: "حلّل الكتلة الحرارية والهندسة الإنشائية لجدران الطين النجدية.",
		},
		keywords: [
			"thermal mass",
			"الكتلة الحرارية",
			"mud-brick",
			"الطين",
			"adobe",
			"furjat",
		],
		answer: {
			en: "### Thermal Mass and Earthen Structural Engineering\n\nNajdi construction in At-Turaif relies on thick load-bearing mud-brick (adobe) walls raised above stone foundations along the edge of Wadi Hanifah. The high thermal mass of sun-dried earthen masonry slows heat transfer during daytime desert peaks and releases stored warmth into the cool desert night.\n\nBuilders typically tapered wall thickness upward across multi-story elevations and pierced the upper registers with stepped triangular vents (furjat) and crenellated parapets, balancing structural compression with passive cross-ventilation and daylight modulation.",
			ar: "### الكتلة الحرارية والهندسة الإنشائية للطين النجدي\n\nيعتمد البناء النجدي في حي الطريف على جدران حاملة سميكة من اللبن الطيني المجفف تحت الشمس فوق أساسات حجرية بمحاذاة وادي حنيفة. تعمل الكتلة الحرارية العالية للطين على إبطاء انتقال الحرارة خلال ذروة النهار وتفريغ الدفء المختزن ليلاً.\n\nدرّج البنّاؤون سماكة الجدران نحو الأعلى وفتحوا في مستوياتها العليا فرجات مثلثة وشرفات مسننة توازن بين المتانة الإنشائية والتهوية السلبية وتنظيم الإضاءة.",
		},
		sourceKeys: ["unesco-1329"],
	},
	{
		id: "diriyah-academic-2",
		site: "diriyah",
		persona: "ACADEMIC",
		prompt: {
			en: "Compare At-Turaif defensive fortifications with UNESCO Criterion (iv) dossiers.",
			ar: "قارن التحصينات الدفاعية في الطريف مع معايير ملف اليونسكو (الرابع).",
		},
		keywords: [
			"fortifications",
			"التحصينات",
			"criterion",
			"معايير",
			"shurfat",
			"battlements",
			"شرفات",
		],
		answer: {
			en: "### At-Turaif Fortifications and UNESCO Criterion (iv)\n\nUnder UNESCO Criterion (iv), At-Turaif is recognized as an outstanding example of a Najdi architectural ensemble illustrating a significant period in the human settlement of the central Arabian plateau. Its defensive network integrates natural escarpments along Wadi Hanifah with mud-brick citadels, watchtowers and crenellated parapets.\n\nBuilt during the 18th-century expansion of the First Saudi State and besieged in 1818 by Ottoman-Egyptian forces, these fortifications demonstrate how earthen masonry was adapted to citadel defense.",
			ar: "### تحصينات الطريف والمعيار الرابع لليونسكو\n\nوفق المعيار الرابع لليونسكو (iv)، يُعدّ حي الطريف نموذجاً بارزاً للمجموعة المعمارية النجدية التي توثّق مرحلة مهمة من الاستقرار البشري في هضبة وسط الجزيرة العربية. وتدمج منظومته الدفاعية بين الحواف الطبيعية لوادي حنيفة والأسوار الطينية وأبراج المراقبة والشرفات المسننة.\n\nشُيّدت هذه التحصينات إبان ازدهار الدولة السعودية الأولى في القرن الثامن عشر وصمدت حتى حصار عام ١٨١٨، مبرزةً تكييف العمارة الطينية للأغراض الدفاعية.",
		},
		sourceKeys: ["unesco-1329"],
	},
	{
		id: "diriyah-academic-3",
		site: "diriyah",
		persona: "ACADEMIC",
		prompt: {
			en: "How did palm-trunk timber roofing span monumental halls in Salwa Palace?",
			ar: "كيف استُخدمت جذوع النخيل لتسقيف القاعات الكبرى في قصر سلوى؟",
		},
		keywords: [
			"palm-trunk",
			"جذوع النخيل",
			"roofing",
			"تسقيف",
			"salwa",
			"سلوى",
		],
		answer: {
			en: "### Palm-Trunk Roofing Systems in Salwa Palace\n\nIn the oasis environment of Wadi Hanifah, Najdi builders traditionally roofed rooms using split trunks of date palms overlaid with woven palm fronds and sealed with compacted mud plaster. Because single palm-trunk beams had a limited clear span, monumental reception halls in Salwa Palace—the largest building complex in At-Turaif—introduced intermediate stone or mud-brick pillars carrying timber capitals.\n\nThis hypostyle structural arrangement distributed roof loads evenly across thick adobe walls while supporting multi-story palatial construction.",
			ar: "### منظومات التسقيف بجذوع النخيل في قصر سلوى\n\nفي بيئة واحة وادي حنيفة، اعتاد البنّاؤون النجديون تسقيف الغرف بجذوع النخيل المغطاة بالسعف المنسوج وطبقة من الطين المدكوك. ونظراً لمحدودية البحر الإنشائي لجذع النخلة الواحد، اعتمدت القاعات الكبرى في قصر سلوى—أكبر مجمعات حي الطريف—على أعمدة داخلية تحمل تيجاناً خشبية.\n\nأتاح هذا التخطيط ذو الأعمدة توزيع أحمال السقف بانتظام على الجدران الطينية السميكة ودعم بناء الطوابق المتعددة.",
		},
		sourceKeys: ["unesco-1329"],
	},
	{
		id: "hegra-storyteller-overview",
		site: "hegra",
		persona: "STORYTELLER",
		prompt: null,
		keywords: ["hegra", "hijr", "الحجر", "مدائن صالح", "nabataean", "النبطية"],
		answer: {
			en: "### Hegra, Sculpted in Desert Sandstone\n\nRising from the golden plains of AlUla, Hegra is the largest conserved site of the Nabataean civilisation south of Petra. Between the 1st century BC and the 1st century AD, Nabataean stonecutters carved 111 monumental tombs directly into freestanding sandstone outcrops along the ancient caravan trade routes.\n\nInscribed in 2008 under criteria (ii) and (iii) as Saudi Arabia's first UNESCO World Heritage site, Hegra still preserves its decorated facades, desert wells and Nabataean Aramaic inscriptions.",
			ar: "### الحِجر منحوتةً في صخور الصحراء الرملية\n\nوسط سهول العلا الذهبية تبرز الحِجر (مدائن صالح) بوصفها أكبر موقع محفوظ للحضارة النبطية جنوب البتراء. وبين القرن الأول قبل الميلاد والقرن الأول الميلادي، نحت البنّاؤون الأنباط ١١١ مقبرة صخرية ضخمة في الكتل الرملية على امتداد طرق القوافل القديمة.\n\nأُدرجت الحِجر عام ٢٠٠٨ كأول موقع سعودي في قائمة التراث العالمي لليونسكو، ولا تزال تحتفظ بواجهاتها المزخرفة وآبارها ونقوشها النبطية.",
		},
		sourceKeys: ["unesco-1293"],
	},
	{
		id: "hegra-storyteller-1",
		site: "hegra",
		persona: "STORYTELLER",
		prompt: {
			en: "Who was Lihyan son of Kuza, and why stands his tomb Qasr al-Farid unfinished?",
			ar: "من هو لحيان بن كوزا، ولماذا بقي قصر الفريد غير مكتمل؟",
		},
		keywords: [
			"lihyan",
			"kuza",
			"qasr al-farid",
			"unfinished",
			"pilasters",
			"لحيان",
			"قصر الفريد",
			"غير مكتمل",
		],
		answer: {
			en: "### The Solitary Monolith of Qasr al-Farid\n\nStanding alone against the desert horizon, Qasr al-Farid is carved into a single sandstone outcrop rather than a shared cliff face. An inscription traditionally attributes the tomb to Lihyan son of Kuza, and its grand facade displays four pilasters instead of the usual two.\n\nBecause Nabataean masons worked from the top down, the stepped crowstep crown and classical entablature stand crisply finished above, while the lower base remains rough uncarved stone where the chisels fell silent.",
			ar: "### الصخرة المنفردة في قصر الفريد\n\nيقف قصر الفريد وحيداً في أفق الصحراء، إذ نُحت في كتلة رملية مستقلة بدلاً من سفح جبلي مشترك. وتنسب النقوش المقبرة تقليدياً إلى لحيان بن كوزا، وتتميّز واجهتها المهيبة بأربعة أعمدة جدارية بدلاً من عمودين.\n\nولأن النحّاتين الأنباط كانوا ينحتون الصخر من الأعلى إلى الأسفل، فقد اكتملت الشرفات المدرجة والإفريز العلوي بدقة، بينما بقي الجزء السفلي صخراً غير مكتمل حيث توقفت الأزاميل.",
		},
		sourceKeys: ["unesco-1293"],
	},
	{
		id: "hegra-storyteller-2",
		site: "hegra",
		persona: "STORYTELLER",
		prompt: {
			en: "Describe the incense caravans arriving at Hegra under the desert stars.",
			ar: "صف قوافل البخور والتوابل حين تصل إلى الحِجر تحت نجوم الصحراء.",
		},
		keywords: ["incense", "caravans", "قوافل", "البخور", "wells", "trade"],
		answer: {
			en: "### Caravan Lanterns Across the Incense Route\n\nLong before dusk cooled the sandstone cliffs, camel caravans bearing frankincense, myrrh and aromatics from southern Arabia sighted the outcrops of Hegra. Positioned along the primary caravan trade route linking the south to the Mediterranean world, the oasis offered travelers deep rock-cut wells and secure halting grounds.\n\nAround those wells and beneath the monumental tomb facades of the 1st century BC and 1st century AD, merchants from distant traditions exchanged goods and architectural ideas.",
			ar: "### قوافل البخور على دروب التجارة القديمة\n\nقبل أن يبرد صخر الجبال الرملية عند المساء، كانت قوافل الإبل المحمّلة باللبان والمرّ والطيب القادمة من جنوب الجزيرة العربية تلمح التكوينات الصخرية في الحِجر. وبفضل موقعها الحيوي على طريق القوافل التجاري، وفّرت الواحة للمسافرين آباراً منحوتة في الصخر ومحطات آمنة للاستراحة.\n\nحول تلك الآبار وتحت واجهات المقابر الشاهقة التي تعود للقرن الأول قبل الميلاد والقرن الأول الميلادي، التقى التجار وتبادلوا السلع والخبرات المعمارية.",
		},
		sourceKeys: ["unesco-1293"],
	},
	{
		id: "hegra-storyteller-3",
		site: "hegra",
		persona: "STORYTELLER",
		prompt: {
			en: "What curses and guardians were carved above the Nabataean tomb facades?",
			ar: "ما النقوش والحمايات المنحوتة فوق واجهات المقابر النبطية؟",
		},
		keywords: [
			"curses",
			"guardians",
			"inscriptions",
			"aramaic",
			"fines",
			"النقوش",
			"الغرامات",
			"واجهات",
		],
		answer: {
			en: "### Stone Charters Above the Tomb Doors\n\nCarved into recessed sandstone plaques above many doorways at Hegra are Nabataean Aramaic inscriptions that read like formal legal charters in stone. Rather than anonymous monuments, these 1st century BC to 1st century AD monumental tombs name their owners, their families and often the stonecutters who sculpted the decorated facades.\n\nThe inscriptions also warn against unauthorized burials or altering the tomb, invoking protective Nabataean deities and setting strict fines for misuse across generations.",
			ar: "### مواثيق الحجر فوق بوابات المقابر\n\nفوق مداخل كثير من مقابر الحِجر نُحتت ألواح تحمل نقوشاً بالخط النبطي الآرامي أشبه بوثائق قانونية موثّقة في الصخر. فهذه المقابر التي تعود إلى الفترة بين القرن الأول قبل الميلاد والقرن الأول الميلادي تذكر أسماء أصحابها وعائلاتهم، وغالباً ما تسجّل اسم النحّات الذي أنجزها.\n\nكما تتضمن النصوص تحذيرات صارمة من الدفن غير المأذون به أو بيع المقبرة، وتفرض غرامات محددة لحماية المدفن عبر الأجيال.",
		},
		sourceKeys: ["unesco-1293"],
	},
	{
		id: "hegra-academic-overview",
		site: "hegra",
		persona: "ACADEMIC",
		prompt: null,
		keywords: ["hegra", "hijr", "nabataean", "criteria", "الحجر", "النبطية"],
		answer: {
			en: "### Archaeological Overview of Hegra (al-Hijr)\n\nInscribed in 2008 under UNESCO criteria (ii) and (iii) as Saudi Arabia's first World Heritage property, Hegra (al-Hijr / Madâin Sâlih) is the largest conserved site of the Nabataean civilisation south of Petra. The site comprises 111 monumental rock-cut tombs dating from the 1st century BC to the 1st century AD, alongside hydraulic wells and Nabataean Aramaic inscriptions.\n\nIts decorated facades and oasis infrastructure document Nabataean architectural synthesis and agricultural mastery along caravan trade networks.",
			ar: "### نظرة أثرية ومعمارية على موقع الحِجر\n\nأُدرج موقع الحِجر (مدائن صالح) عام ٢٠٠٨ وفق المعيارين (ii) و(iii) كأول موقع سعودي في قائمة التراث العالمي لليونسكو، وهو أكبر موقع محفوظ للحضارة النبطية جنوب البتراء. يضم الموقع ١١١ مقبرة صخرية ضخمة مؤرخة بين القرن الأول قبل الميلاد والقرن الأول الميلادي، إضافةً إلى آبار مائية ونقوش نبطية آرامية.\n\nتوثّق واجهاته المزخرفة ومنظوماته المائية التمازج المعماري النبطي وبراعة إدارة الواحات على طرق القوافل.",
		},
		sourceKeys: ["unesco-1293"],
	},
	{
		id: "hegra-academic-1",
		site: "hegra",
		persona: "ACADEMIC",
		prompt: {
			en: "Examine the top-down rock-cut carving methodology of Hegra's 111 monumental tombs.",
			ar: "افحص منهجية النحت من الأعلى إلى الأسفل في مقابر الحِجر الصخرية.",
		},
		keywords: [
			"top-down",
			"carving",
			"111",
			"monumental tombs",
			"النحت",
			"الأعلى إلى الأسفل",
		],
		answer: {
			en: "### Top-Down Subtractive Rock-Cut Methodology\n\nAcross Hegra's 111 monumental tombs, Nabataean stonecutters of the 1st century BC to 1st century AD employed a subtractive top-down carving sequence. Masons first dressed the upper sandstone cliff face, cutting the stepped crowstep crest and cornice before working downward through the entablature, pilasters and doorway.\n\nQasr al-Farid, a single-rock tomb traditionally attributed to Lihyan son of Kuza, provides direct archaeological evidence of this sequence: its upper architectural order is fully articulated while its lower base remains uncarved.",
			ar: "### منهجية النحت التنازلي في الصخر الرملي\n\nاعتمد النحّاتون الأنباط في مقابر الحِجر البالغ عددها ١١١ مقبرة بين القرن الأول قبل الميلاد والقرن الأول الميلادي أسلوب النحت التنازلي من الأعلى إلى الأسفل. فقد كان البنّاؤون يمهّدون أعلى الواجهة الصخرية أولاً، ثم ينحتون الشرفات المدرجة والإفريز العلوي قبل النزول تدريجياً نحو الأعمدة الجدارية والمدخل.\n\nويقدّم قصر الفريد المنسوب تقليدياً إلى لحيان بن كوزا دليلاً أثرياً واضحاً على هذه المنهجية، إذ اكتملت عناصره العلوية بينما بقيت قاعدته السفلية غير منحوتة.",
		},
		sourceKeys: ["unesco-1293"],
	},
	{
		id: "hegra-academic-2",
		site: "hegra",
		persona: "ACADEMIC",
		prompt: {
			en: "What hydraulic cistern networks sustained Nabataean agriculture in AlUla?",
			ar: "ما شبكات القنوات والصهاريج المائية التي عمّرت الزراعة النبطية في العلا؟",
		},
		keywords: [
			"hydraulic",
			"cistern",
			"wells",
			"agriculture",
			"الصهاريج",
			"الزراعة",
			"آبار",
		],
		answer: {
			en: "### Nabataean Hydraulic Engineering and Oasis Wells\n\nHighlighted under UNESCO criterion (iii), Hegra preserves an extensive system of rock-cut wells and water-harvesting features that sustained Nabataean settlement and oasis agriculture in an arid environment. Engineers excavated deep wells into the sandstone aquifer and channeled seasonal runoff to irrigate cultivated plots.\n\nMany of these ancient wells remain identifiable across the site, demonstrating how hydraulic management enabled Hegra to provision caravan trade routes between the 1st century BC and the 1st century AD.",
			ar: "### الهندسة المائية النبطية وآبار الواحة\n\nوفق ما يبرزه المعيار الثالث لليونسكو (iii)، يحتفظ موقع الحِجر بمنظومة واسعة من الآبار المنحوتة في الصخر ومنشآت حصاد المياه التي دعمت الاستقرار النبطي والزراعة في بيئة صحراوية جافة. فقد حفر المهندسون الأنباط آباراً عميقة للوصول إلى المياه الجوفية ووجّهوا مياه السيول الموسمية لريّ المزارع.\n\nولا تزال العديد من هذه الآبار قائمة في الموقع، شاهدةً على كفاءة الإدارة المائية التي مكّنت الحِجر من تموين طرق القوافل التجارية.",
		},
		sourceKeys: ["unesco-1293"],
	},
	{
		id: "hegra-academic-3",
		site: "hegra",
		persona: "ACADEMIC",
		prompt: {
			en: "Trace the Hellenistic and Mesopotamian synthesis in Nabataean entablatures.",
			ar: "تتبّع التمازج الهلنستي والرافدي في تيجان الواجهات النبطية.",
		},
		keywords: [
			"hellenistic",
			"mesopotamian",
			"entablatures",
			"crowstep",
			"pilasters",
			"الهلنستي",
			"الرافدي",
			"الشرفات المدرجة",
		],
		answer: {
			en: "### Architectural Synthesis Under UNESCO Criterion (ii)\n\nInscribed under UNESCO criterion (ii) for its interchange of human and cultural values, Hegra's decorated tomb facades synthesize Near Eastern and classical decorative traditions into an original Nabataean architectural idiom. Upper superstructures typically feature opposing stepped crowstep crowns rooted in Mesopotamian and Near Eastern building traditions.\n\nBeneath these stepped crowns, Nabataean stonecutters carved classical pilasters and entablatures directly into the sandstone cliffs, creating a distinctive 1st century BC to 1st century AD monumental vocabulary.",
			ar: "### التمازج المعماري وفق المعيار الثاني لليونسكو\n\nتُجسّد واجهات المقابر في الحِجر—المدرجة وفق المعيار الثاني لليونسكو (ii) لتبادل القيم الثقافية—تمازجاً فريداً بين التقاليد المعمارية الشرقية القديمة والعناصر الكلاسيكية الهلنستية والرومانية ضمن أسلوب نبطي أصيل. إذ تتوّج الأجزاءَ العلويةَ شرفاتٌ مدرّجة متقابلة تعود جذورها إلى عمارة الشرق الأدنى وبلاد الرافدين.\n\nوتحت هذه الشرفات نحت البنّاؤون الأفاريز الكلاسيكية والأعمدة الجدارية ذات التيجان النبطية المميزة.",
		},
		sourceKeys: ["unesco-1293"],
	},
	{
		id: "jeddah-storyteller-overview",
		site: "jeddah",
		persona: "STORYTELLER",
		prompt: null,
		keywords: [
			"jeddah",
			"balad",
			"جدة",
			"البلد",
			"rawashin",
			"الرواشين",
			"red sea",
		],
		answer: {
			en: "### Historic Jeddah, the Gate to Makkah\n\nOn the eastern shore of the Red Sea, Historic Jeddah (Al-Balad) has welcomed mariners, merchants and pilgrims since the 7th century. As the maritime gateway for pilgrims arriving by sea for Makkah and a major port on the Indian Ocean trade routes, the city flourished as a cosmopolitan crossroads.\n\nIn the late 19th century its mercantile elites raised tall coral-stone tower houses adorned with carved wooden rawashin—an urban heritage inscribed by UNESCO in 2014.",
			ar: "### جدة التاريخية بوابة مكة البحرية\n\nعلى الساحل الشرقي للبحر الأحمر استقبلت جدة التاريخية (البلد) البحّارة والتجار والحجاج منذ القرن السابع الميلادي. وبوصفها البوابة البحرية للحجاج القادمين إلى مكة المكرمة وميناءً رئيسياً على خطوط تجارة المحيط الهندي، ازدهرت المدينة كملتقى ثقافي حيوي.\n\nوفي أواخر القرن التاسع عشر شيّدت نخبها التجارية بيوتاً برجية من الحجر المرجاني تزيّنها الرواشين الخشبية المنحوتة، وهو الإرث الذي أدرجته اليونسكو عام ٢٠١٤.",
		},
		sourceKeys: ["unesco-1361"],
	},
	{
		id: "jeddah-storyteller-1",
		site: "jeddah",
		persona: "STORYTELLER",
		prompt: {
			en: "Take me inside Beit Nassif as pilgrims and merchants arrive from the Red Sea.",
			ar: "خذني في جولة داخل بيت نصيف مع توافد الحجاج والتجار عبر البحر الأحمر.",
		},
		keywords: [
			"beit nassif",
			"بيت نصيف",
			"pilgrims",
			"الحجاج",
			"merchants",
			"التجار",
		],
		answer: {
			en: "### Inside Beit Nassif, Where Sea Routes Met\n\nStep through the grand wooden portal of Beit Nassif, one of the best-known tower houses of Al-Balad, and the bustle of the Red Sea port gives way to shaded stone halls. Built in the late 19th century, when Jeddah's mercantile elites hosted scholars, dignitaries and pilgrims bound for Makkah, the house rises in broad tiers of coral masonry.\n\nThrough its wide timber stairs and breezy upper chambers, cargoes and conversations from across the Indian Ocean converged.",
			ar: "### داخل بيت نصيف حيث التقت دروب البحر\n\nحين تعبر البوابة الخشبية المهيبة لبيت نصيف، أحد أشهر البيوت البرجية في حي البلد، يهدأ صخب ميناء البحر الأحمر داخل ردهاته الحجرية المظلّلة. شُيّد هذا البيت في أواخر القرن التاسع عشر حين كانت النخب التجارية في جدة تستضيف العلماء والأعيان والحجاج المتجهين إلى مكة المكرمة.\n\nوعبر سلالمه العريضة وغرفه العلوية التي يتخللها النسيم، التقت ثقافات المحيط الهندي وتجاراته.",
		},
		sourceKeys: ["unesco-1361"],
	},
	{
		id: "jeddah-storyteller-2",
		site: "jeddah",
		persona: "STORYTELLER",
		prompt: {
			en: "How did the carved wooden rawashin catch the sea breeze at dusk?",
			ar: "كيف كانت الرواشين الخشبية المنحوتة تلتقط نسيم البحر عند الغروب؟",
		},
		keywords: [
			"rawashin",
			"الرواشين",
			"breeze",
			"نسيم",
			"wooden",
			"cool",
			"تبريد",
		],
		answer: {
			en: "### Sea Breezes Through the Wooden Rawashin\n\nAs evening settles over the eastern shore of the Red Sea, the tall coral-stone facades of Al-Balad glow behind cantilevered wooden bay windows known as rawashin. Crafted from fine imported timber, their louvered lattices project outward into the narrow lanes to catch every cooling draft off the water.\n\nInside the tower houses, families could sit in shaded comfort and look out over the street below while the intricate woodwork filtered the sun and preserved household privacy.",
			ar: "### نسائم البحر عبر الرواشين الخشبية\n\nمع حلول المساء فوق ساحل البحر الأحمر، تتألق الواجهات العالية في حي البلد خلف الشرفات الخشبية البارزة المعروفة بالرواشين. صُنعت هذه المشربيات من الأخشاب المستوردة المتقنة لتبرز نحو الأزقة الضيقة وتلتقط كل نسمة هواء باردة قادمة من البحر.\n\nوفي الداخل كان أهل البيت يجلسون في ظلٍّ وارف يطلّون منه على الحركة في الأسفل، بينما تكسر الزخارف الخشبية وهج الشمس وتحفظ الخصوصية.",
		},
		sourceKeys: ["unesco-1361"],
	},
	{
		id: "jeddah-storyteller-3",
		site: "jeddah",
		persona: "STORYTELLER",
		prompt: {
			en: "Why was fossilized coral stone raised from the lagoon to build Al-Balad?",
			ar: "لماذا شُيّدت مباني جدة التاريخية من حجر المنقبي المرجاني؟",
		},
		keywords: ["coral", "manqabi", "lagoon", "المرجاني", "المنقبي", "حجر"],
		answer: {
			en: "### Towers Built from the Red Sea Lagoon\n\nWith scarce quarry stone along the coastal plain, the builders of Historic Jeddah turned to the Red Sea lagoon itself, shaping blocks of porous coral stone known as manqabi. Light yet resilient, these coral blocks held tiny air pockets that helped insulate the late 19th-century tower houses against coastal heat and humidity.\n\nCoated in bright lime plaster and laced with horizontal timber courses (taklil), the coral walls rose high above the alleys of Al-Balad.",
			ar: "### أبراج مشيّدة من مرجان البحر الأحمر\n\nأمام ندرة مقالع الحجر الصلب في السهل الساحلي، اتجه بنّاؤو جدة التاريخية إلى البحر الأحمر نفسه ليقتطعوا كتل الحجر المرجاني المسامي المعروف بالمنقبي. وامتازت هذه الحجارة بخفة وزنها ومساميتها الهوائية التي عزلت البيوت البرجية متعددة الطوابق عن حرارة الساحل ورطوبته.\n\nومع كسوتها بالنورة البيضاء وتدعيمها بالعوارض الخشبية الأفقية، ارتفعت الجدران المرجانية شامخةً فوق أزقة البلد.",
		},
		sourceKeys: ["unesco-1361"],
	},
	{
		id: "jeddah-academic-overview",
		site: "jeddah",
		persona: "ACADEMIC",
		prompt: null,
		keywords: ["jeddah", "balad", "criteria", "rawashin", "جدة", "البلد"],
		answer: {
			en: "### Architectural and Urban Overview of Historic Jeddah\n\nInscribed on the UNESCO World Heritage List in 2014 under criteria (ii), (iv) and (vi), Historic Jeddah, the Gate to Makkah, developed from the 7th century on the eastern shore of the Red Sea as an Indian Ocean trade port and the maritime entry point for pilgrims bound for Makkah.\n\nIts urban fabric is distinguished by late 19th-century multi-story tower houses built of coral stone (manqabi), reinforced with timber courses (taklil) and shaded by wooden rawashin.",
			ar: "### نظرة معمارية وعمرانية على جدة التاريخية\n\nأُدرجت جدة التاريخية (بوابة مكة) في قائمة التراث العالمي لليونسكو عام ٢٠١٤ وفق المعايير (ii) و(iv) و(vi). تطورت المدينة منذ القرن السابع الميلادي على الساحل الشرقي للبحر الأحمر كميناء رئيسي لتجارة المحيط الهندي وبوابة بحرية للحجاج المتجهين إلى مكة المكرمة.\n\nيتميّز نسيجها العمراني ببيوتها البرجية المشيّدة في أواخر القرن التاسع عشر من حجر المنقبي المرجاني والمدعّمة بأخشاب التكليل والرواشين الخشبية.",
		},
		sourceKeys: ["unesco-1361"],
	},
	{
		id: "jeddah-academic-1",
		site: "jeddah",
		persona: "ACADEMIC",
		prompt: {
			en: "Evaluate the passive cross-ventilation mechanics of Hejazi rawashin mashrabiyas.",
			ar: "قيّم آليات التهوية المتقاطعة السلبية في الرواشين والمشربيات الحجازية.",
		},
		keywords: [
			"cross-ventilation",
			"rawashin",
			"mashrabiyas",
			"التهوية",
			"الرواشين",
			"المشربيات",
		],
		answer: {
			en: "### Passive Cross-Ventilation in Hejazi Rawashin\n\nIn the humid coastal climate of the eastern Red Sea shore, the late 19th-century tower houses of Historic Jeddah employ large wooden rawashin to drive passive cooling. Projecting beyond the coral-stone (manqabi) facade on three sides, the louvered woodwork captures prevailing sea breezes from multiple angles and channels air through the living quarters.\n\nCombined with tall vertical stairwells and shaded alleys, the rawashin reduce solar heat gain while providing shade, continuous ventilation and visual privacy.",
			ar: "### آليات التهوية المتقاطعة السلبية في الرواشين الحجازية\n\nفي المناخ الساحلي الرطب للبحر الأحمر، تعتمد البيوت البرجية المشيّدة في أواخر القرن التاسع عشر بجدة التاريخية على الرواشين الخشبية الكبيرة لتحقيق التبريد السلبي. وببروزها خارج الواجهة المرجانية من ثلاث جهات، تلتقط فتحاتها الخشبية المائلة نسيم البحر من زوايا متعددة وتوجّهه عبر غرف المعيشة.\n\nوبالتكامل مع بيوت الدرج الرأسية والأزقة المظللة، تقلّل الرواشين الكسب الحراري الشمسي وتضمن تهوية مستمرة وخصوصية بصرية.",
		},
		sourceKeys: ["unesco-1361"],
	},
	{
		id: "jeddah-academic-2",
		site: "jeddah",
		persona: "ACADEMIC",
		prompt: {
			en: "Document the structural role of teakwood taklil courses in coral-stone masonry.",
			ar: "وثّق الدور الإنشائي لأخشاب التكليل في البناء بالحجر المرجاني المنقبي.",
		},
		keywords: [
			"taklil",
			"teakwood",
			"teak",
			"timber",
			"coral-stone",
			"التكليل",
			"عوارض",
			"المنقبي",
		],
		answer: {
			en: "### Structural Role of Taklil Timber Courses in Coral Masonry\n\nBuilders in Historic Jeddah constructed late 19th-century multi-story tower houses using blocks of porous coral stone (manqabi) set in lime mortar. Because coral blocks vary in density and compressive strength, masons laid horizontal timber tie-beams—known as taklil—at regular vertical intervals through the coral-stone walls.\n\nThese timber courses distributed vertical loads evenly across the wall section, arrested potential cracks, and tied corners together against differential settlement along the Red Sea coast.",
			ar: "### الدور الإنشائي لأحزمة التكليل الخشبية في البناء المرجاني\n\nشيّد البنّاؤون في جدة التاريخية الجدران متعددة الطوابق باستخدام كتل الحجر المرجاني المسامي (المنقبي) المربوطة بمونة النورة. ونظراً لتفاوت كثافة الكتل المرجانية ومقاومتها للضغط، أدمج البنّاؤون أحزمةً خشبية أفقية تُعرف بالتكليل على مسافات رأسية منتظمة داخل الجدار.\n\nأسهمت عوارض التكليل في توزيع الأحمال الرأسية بانتظام عبر مقطع الجدار، ومنع انتشار التصدعات، وربط الأركان لمقاومة الهبوط التفاضلي في التربة الساحلية.",
		},
		sourceKeys: ["unesco-1361"],
	},
	{
		id: "jeddah-academic-3",
		site: "jeddah",
		persona: "ACADEMIC",
		prompt: {
			en: "How did 19th-century Indian Ocean trade shape Al-Balad's vertical tower houses?",
			ar: "كيف شكّلت تجارة المحيط الهندي في القرن التاسع عشر بيوت جدة البرجية؟",
		},
		keywords: [
			"indian ocean",
			"trade",
			"tower houses",
			"19th-century",
			"المحيط الهندي",
			"البرجية",
			"تجارة",
		],
		answer: {
			en: "### Indian Ocean Trade and the Red Sea Tower House Tradition\n\nRecognized under UNESCO criteria (ii), (iv) and (vi), Historic Jeddah served for centuries as a major port for Indian Ocean trade routes and the gateway for pilgrims traveling by sea to Makkah. In the late 19th century, expanding maritime commerce enabled the city's mercantile elites to build tall tower houses such as Beit Nassif.\n\nImported hardwoods from Indian Ocean trade supplied the structural taklil beams and intricate rawashin that defined Al-Balad's vertical architecture.",
			ar: "### تجارة المحيط الهندي وتقاليد البيوت البرجية في البحر الأحمر\n\nوفق المعايير (ii) و(iv) و(vi) لليونسكو، مثّلت جدة التاريخية لقرونٍ ميناءً رئيسياً لخطوط تجارة المحيط الهندي وبوابةً بحرية للحجاج المتجهين إلى مكة المكرمة. وفي أواخر القرن التاسع عشر، مكّن ازدهار التجارة البحرية النخبَ التجارية في المدينة من تشييد بيوت برجية عالية مثل بيت نصيف.\n\nوقد وفّرت تجارة المحيط الهندي الأخشاب الصلبة المستوردة التي صُنعت منها عوارض التكليل الإنشائية والرواشين المنحوتة التي ميّزت عمارة البلد الرأسية.",
		},
		sourceKeys: ["unesco-1361"],
	},
];
