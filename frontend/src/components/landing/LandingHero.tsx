import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type React from "react";
import DuneHorizon from "@/components/landing/DuneHorizon";
import ThemeToggle from "@/components/landing/ThemeToggle";
import HeritageOrnament from "@/components/ui/HeritageOrnament";

interface LandingHeroProps {
	locale: string;
}

export default async function LandingHero({
	locale,
}: LandingHeroProps): Promise<React.ReactElement> {
	const t = await getTranslations("Landing");
	const tCommon = await getTranslations("Common");
	const otherLocale = locale === "ar" ? "en" : "ar";

	return (
		<section
			aria-labelledby="landing-hero-title"
			className="relative min-h-dvh flex flex-col overflow-hidden"
		>
			<HeritageOrnament variant="najdi-band" />
			<nav
				aria-label={tCommon("title")}
				className="relative z-10 w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between"
			>
				<span className="font-display font-bold text-lg tracking-wide">
					{locale === "ar"
						? "الراوي · Al-Rawi"
						: `الراوي · ${tCommon("title")}`}
				</span>
				<div className="flex items-center gap-2">
					<ThemeToggle />
					<a
						href={`/${otherLocale}`}
						className="text-xs bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-xl px-3 py-2 font-semibold"
					>
						{otherLocale === "ar" ? "العربية" : "English"}
					</a>
				</div>
			</nav>

			<div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-40">
				<div className="landing-rise flex flex-col items-center gap-6 max-w-3xl">
					<div className="p-4 rounded-full manuscript-card border border-[var(--border-strong)]">
						<HeritageOrnament
							variant="astrolabe"
							className="w-16 h-16 landing-spin-slow"
						/>
					</div>
					<p className="text-xs font-mono-tabular uppercase tracking-[0.25em] text-[var(--accent-gold)]">
						{t("heroEyebrow")}
					</p>
					<h1
						id="landing-hero-title"
						className="font-display text-4xl sm:text-6xl font-bold leading-tight"
					>
						{t("heroTitle")}
					</h1>
					<p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
						{t("heroBody")}
					</p>
					<div className="flex flex-wrap items-center justify-center gap-3 pt-2">
						<Link
							href={`/${locale}/explore`}
							className="heritage-chip px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2"
						>
							{t("ctaPrimary")}
							<ArrowRight
								className="w-4 h-4 rtl:rotate-180"
								aria-hidden="true"
							/>
						</Link>
						<a
							href="#how-it-works"
							className="px-6 py-3 rounded-xl text-sm font-medium border border-[var(--border-strong)] hover:bg-[var(--bg-elevated)] inline-flex items-center gap-2"
						>
							{t("ctaSecondary")}
							<ChevronDown className="w-4 h-4" aria-hidden="true" />
						</a>
					</div>
				</div>
			</div>

			<DuneHorizon className="absolute bottom-0 inset-inline-0 w-full h-40 sm:h-56" />
		</section>
	);
}
