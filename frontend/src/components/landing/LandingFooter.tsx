import { ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type React from "react";
import ThemeToggle from "@/components/landing/ThemeToggle";
import HeritageOrnament from "@/components/ui/HeritageOrnament";

interface LandingFooterProps {
	locale: string;
}

export default async function LandingFooter({
	locale,
}: LandingFooterProps): Promise<React.ReactElement> {
	const t = await getTranslations("Landing");
	const otherLocale = locale === "ar" ? "en" : "ar";

	return (
		<footer className="relative px-6 pt-24 pb-10 text-center">
			<div className="max-w-2xl mx-auto space-y-5">
				<HeritageOrnament variant="astrolabe" className="w-10 h-10 mx-auto" />
				<h2 className="font-display text-3xl font-bold">{t("footerTitle")}</h2>
				<p className="text-[var(--text-secondary)]">{t("footerBody")}</p>
				<Link
					href={`/${locale}/explore`}
					className="heritage-chip inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
				>
					{t("ctaPrimary")}
					<ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
				</Link>
			</div>
			<div className="mt-16 pt-6 border-t border-[var(--border-subtle)] max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
				<span>{t("license")}</span>
				<div className="flex items-center gap-3">
					<a
						href="https://github.com/D0nG4667/Al-Rawi"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1.5 hover:text-[var(--text-primary)]"
					>
						<Code2 className="w-4 h-4" aria-hidden="true" />
						{t("repository")}
					</a>
					<a
						href={`/${otherLocale}`}
						className="hover:text-[var(--text-primary)]"
					>
						{otherLocale === "ar" ? "العربية" : "English"}
					</a>
					<ThemeToggle />
				</div>
			</div>
		</footer>
	);
}
