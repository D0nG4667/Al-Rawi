import { BookOpenCheck, Languages, Server } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type React from "react";
import Reveal from "@/components/landing/Reveal";
import HeritageOrnament from "@/components/ui/HeritageOrnament";

const PILLARS = [
	{ id: "trustCited", Icon: BookOpenCheck },
	{ id: "trustArabic", Icon: Languages },
	{ id: "trustHost", Icon: Server },
] as const;

/** Source institutions the archive is designed around. Names only — no logos or endorsements. */
const SOURCE_KEYS = [
	"sourceUnesco",
	"sourceRcu",
	"sourceDgda",
	"sourceDarah",
] as const;

export default async function TrustBand(): Promise<React.ReactElement> {
	const t = await getTranslations("Landing");

	return (
		<section
			aria-labelledby="trust-title"
			className="relative py-24 bg-[var(--bg-surface)] border-y border-[var(--border-subtle)]"
		>
			<HeritageOrnament
				variant="najdi-band"
				className="absolute top-0 inset-inline-0"
			/>
			<div className="px-6 max-w-6xl mx-auto w-full">
				<Reveal className="text-center mb-12 space-y-3">
					<h2
						id="trust-title"
						className="font-display text-3xl sm:text-4xl font-bold"
					>
						{t("trustTitle")}
					</h2>
					<p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
						{t("trustBody")}
					</p>
				</Reveal>
				<div className="grid gap-6 md:grid-cols-3">
					{PILLARS.map(({ id, Icon }, index) => (
						<Reveal key={id} delay={index * 0.08}>
							<div className="manuscript-card h-full p-6 space-y-3 border border-[var(--border-subtle)]">
								<Icon
									className="w-6 h-6 text-[var(--accent-gold)]"
									aria-hidden="true"
								/>
								<h3 className="font-display text-lg font-bold">
									{t(`${id}Title`)}
								</h3>
								<p className="text-sm text-[var(--text-secondary)] leading-relaxed">
									{t(`${id}Body`)}
								</p>
							</div>
						</Reveal>
					))}
				</div>
				<Reveal className="mt-12 text-center space-y-4">
					<p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[var(--text-muted)]">
						{t("sourcesLabel")}
					</p>
					<ul className="flex flex-wrap justify-center gap-2">
						{SOURCE_KEYS.map((key) => (
							<li
								key={key}
								className="text-xs px-3 py-1.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)]"
							>
								{t(key)}
							</li>
						))}
					</ul>
				</Reveal>
			</div>
		</section>
	);
}
