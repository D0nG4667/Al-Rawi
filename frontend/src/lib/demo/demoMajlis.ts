import type { PodcastScript } from "@/components/explore/types";
import type { HeritageSiteId } from "@/store/useUIStore";
import type { LocalizedText } from "./demoArchive.ts";
import type { DemoLocale } from "./matchDemoAnswer.ts";

interface DemoMajlisLine {
	speaker: "Visitor" | "Rawi";
	text: LocalizedText;
}

interface DemoMajlisScript {
	title: LocalizedText;
	lines: readonly DemoMajlisLine[];
}

const DEMO_MAJLIS: Readonly<Record<HeritageSiteId, DemoMajlisScript>> = {
	diriyah: {
		title: {
			en: "At-Turaif: Heart of the First Saudi State",
			ar: "حي الطريف: قلب الدولة السعودية الأولى",
		},
		lines: [
			{
				speaker: "Visitor",
				text: {
					en: "What made At-Turaif so important?",
					ar: "ما الذي جعل حي الطريف بهذه الأهمية؟",
				},
			},
			{
				speaker: "Rawi",
				text: {
					en: "It was the first capital of the Saudi dynasty, founded in the 15th century on the edge of Wadi Hanifah, and the seat of the First Saudi State in the 18th century.",
					ar: "كان العاصمة الأولى للأسرة السعودية، تأسّس في القرن الخامس عشر على حافة وادي حنيفة، وصار مقرّ الدولة السعودية الأولى في القرن الثامن عشر.",
				},
			},
			{
				speaker: "Visitor",
				text: {
					en: "Why did UNESCO inscribe it in 2010?",
					ar: "لماذا أدرجته اليونسكو عام ٢٠١٠؟",
				},
			},
			{
				speaker: "Rawi",
				text: {
					en: "Because it is an outstanding example of the Najdi architectural style: mud-brick palaces and houses shaped by the desert climate and the oasis around them.",
					ar: "لأنه نموذج استثنائي للطراز المعماري النجدي: قصور وبيوت من الطين صاغها مناخ الصحراء والواحة المحيطة بها.",
				},
			},
		],
	},
	hegra: {
		title: {
			en: "Hegra: The Nabataean City of Tombs",
			ar: "الحِجر: مدينة المقابر النبطية",
		},
		lines: [
			{
				speaker: "Visitor",
				text: {
					en: "Who built the tombs of Hegra?",
					ar: "من شيّد مقابر الحِجر؟",
				},
			},
			{
				speaker: "Rawi",
				text: {
					en: "The Nabataeans, the same people who built Petra. Hegra was their largest settlement south of Petra, with 111 monumental tombs carved between the 1st century BC and the 1st century AD.",
					ar: "الأنباط، بُناة البتراء أنفسهم. كانت الحِجر أكبر مستوطناتهم جنوب البتراء، وتضم ١١١ مقبرة ضخمة نُحتت بين القرن الأول قبل الميلاد والقرن الأول الميلادي.",
				},
			},
			{
				speaker: "Visitor",
				text: {
					en: "Is it true it was Saudi Arabia's first World Heritage site?",
					ar: "هل صحيح أنها أول موقع سعودي في قائمة التراث العالمي؟",
				},
			},
			{
				speaker: "Rawi",
				text: {
					en: "Yes. It was inscribed in 2008, and its decorated facades, wells and inscriptions record a civilisation that lived from the caravan trade.",
					ar: "نعم، أُدرجت عام ٢٠٠٨، وتشهد واجهاتها المزخرفة وآبارها ونقوشها على حضارةٍ عاشت على تجارة القوافل.",
				},
			},
		],
	},
	jeddah: {
		title: {
			en: "Historic Jeddah: Gate to Makkah",
			ar: "جدة التاريخية: بوابة مكة",
		},
		lines: [
			{
				speaker: "Visitor",
				text: {
					en: "Why is Historic Jeddah called the gate to Makkah?",
					ar: "لماذا تُسمّى جدة التاريخية بوابة مكة؟",
				},
			},
			{
				speaker: "Rawi",
				text: {
					en: "From the 7th century it was the main port where pilgrims arriving by sea landed before travelling on to Makkah, and a hub for Indian Ocean trade.",
					ar: "منذ القرن السابع كانت الميناء الرئيس الذي ينزل فيه الحجاج القادمون بحراً قبل مواصلة طريقهم إلى مكة، ومحطةً لتجارة المحيط الهندي.",
				},
			},
			{
				speaker: "Visitor",
				text: {
					en: "What makes its houses so distinctive?",
					ar: "ما الذي يميّز بيوتها؟",
				},
			},
			{
				speaker: "Rawi",
				text: {
					en: "Tall tower houses built by merchant families in the late 19th century, made of coral stone and fronted by large wooden rawashin that catch the sea breeze.",
					ar: "بيوت برجية شاهقة شيّدتها العائلات التجارية في أواخر القرن التاسع عشر من الحجر المرجاني، تتقدّمها رواشين خشبية كبيرة تلتقط نسيم البحر.",
				},
			},
		],
	},
};

export function buildDemoMajlisScript(
	site: HeritageSiteId,
	locale: DemoLocale,
): PodcastScript {
	const script = DEMO_MAJLIS[site];
	return {
		title: script.title[locale],
		dialogue: script.lines.map((line, index) => ({
			id: `demo-majlis-${site}-${index}`,
			speaker: line.speaker,
			text: line.text[locale],
		})),
	};
}
