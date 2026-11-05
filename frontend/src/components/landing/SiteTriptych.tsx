import { MapPin } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type React from "react";
import Reveal from "@/components/landing/Reveal";
import { HERITAGE_SITES, type HeritageSiteId } from "@/store/useUIStore";

interface SiteTriptychProps {
	locale: string;
}

const SITE_ORDER: readonly HeritageSiteId[] = ["diriyah", "hegra", "jeddah"];
const INSCRIBED: Readonly<Record<HeritageSiteId, string>> = {
	diriyah: "2010",
	hegra: "2008",
	jeddah: "2014",
};

export default async function SiteTriptych({
	locale,
}: SiteTriptychProps): Promise<React.ReactElement> {
	const t = await getTranslations("Landing");
	const isArabic = locale === "ar";

	return (
		<section
			aria-labelledby="sites-title"
			className="px-6 py-24 max-w-6xl mx-auto w-full"
		>
			<Reveal className="text-center mb-12 space-y-3">
				<h2
					id="sites-title"
					className="font-display text-3xl sm:text-4xl font-bold"
				>
					{t("sitesTitle")}
				</h2>
				<p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
					{t("sitesBody")}
				</p>
			</Reveal>
			<div className="grid gap-6 md:grid-cols-3">
				{SITE_ORDER.map((siteId, index) => {
					const site = HERITAGE_SITES[siteId];
					return (
						<Reveal key={siteId} delay={index * 0.08} className="h-full">
							<article className="manuscript-card h-full p-6 flex flex-col gap-4 border border-[var(--border-subtle)]">
								<header className="space-y-1.5">
									<p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[var(--accent-gold)]">
										{t("inscribed", { year: INSCRIBED[siteId] })} ·{" "}
										{site.unescoRef.split(" · ")[0]}
									</p>
									<h3 className="font-display text-xl font-bold">
										{isArabic ? site.titleAr : site.titleEn}
									</h3>
									<p className="text-xs text-[var(--text-muted)] font-mono-tabular inline-flex items-center gap-1">
										<MapPin className="w-3 h-3" aria-hidden="true" />
										{site.coordinatesLabel}
									</p>
								</header>
								<p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
									{t(`siteStory.${siteId}`)}
								</p>
								<p className="text-xs text-[var(--text-muted)]">
									{isArabic ? site.eraAr : site.eraEn}
								</p>
								<Link
									href={`/${locale}/explore?site=${siteId}`}
									className="heritage-chip self-start px-4 py-2 rounded-lg text-xs font-semibold"
								>
									{t("exploreSite")}
								</Link>
							</article>
						</Reveal>
					);
				})}
			</div>
		</section>
	);
}
