import { Compass, FileText, MessageSquareText, Mic } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type React from "react";
import Reveal from "@/components/landing/Reveal";

const STEPS = [
	{ id: "step1", Icon: MessageSquareText },
	{ id: "step2", Icon: FileText },
	{ id: "step3", Icon: Compass },
	{ id: "step4", Icon: Mic },
] as const;

export default async function CapabilityScroll(): Promise<React.ReactElement> {
	const t = await getTranslations("Landing");

	return (
		<section
			id="how-it-works"
			aria-labelledby="how-title"
			className="px-6 py-24 max-w-5xl mx-auto w-full scroll-mt-8"
		>
			<Reveal className="text-center mb-14 space-y-3">
				<h2
					id="how-title"
					className="font-display text-3xl sm:text-4xl font-bold"
				>
					{t("howTitle")}
				</h2>
				<p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
					{t("howBody")}
				</p>
			</Reveal>
			<ol className="space-y-6">
				{STEPS.map(({ id, Icon }, index) => (
					<li key={id}>
						<Reveal delay={index * 0.06}>
							<div className="glass-panel p-6 flex items-start gap-5 border border-[var(--border-subtle)]">
								<div className="shrink-0 flex flex-col items-center gap-2">
									<span className="text-[10px] font-mono-tabular text-[var(--accent-gold)]">
										0{index + 1}
									</span>
									<div className="p-3 rounded-xl heritage-chip">
										<Icon className="w-5 h-5" aria-hidden="true" />
									</div>
								</div>
								<div className="space-y-1.5">
									<h3 className="font-display text-lg font-bold">
										{t(`${id}Title`)}
									</h3>
									<p className="text-sm text-[var(--text-secondary)] leading-relaxed">
										{t(`${id}Body`)}
									</p>
								</div>
							</div>
						</Reveal>
					</li>
				))}
			</ol>
		</section>
	);
}
