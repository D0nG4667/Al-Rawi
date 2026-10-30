"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SupportButton(): React.ReactElement {
	const t = useTranslations("Dashboard");
	const donationLink = process.env.NEXT_PUBLIC_DONATION_LINK || "#";

	return (
		<a
			href={donationLink}
			target="_blank"
			rel="noopener noreferrer"
			className="fixed bottom-5 inset-inline-start-5 z-30 hidden xl:flex glass-panel px-3.5 py-2 items-center gap-2 hover:border-[var(--border-strong)] transition-all pointer-events-auto text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
		>
			<Heart className="w-3.5 h-3.5 text-[var(--accent-terracotta)] animate-pulse" />
			<span className="font-medium">{t("supportUs")}</span>
		</a>
	);
}
