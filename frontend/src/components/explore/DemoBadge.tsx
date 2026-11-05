"use client";

import { BookMarked } from "lucide-react";
import { useTranslations } from "next-intl";
import type React from "react";

interface DemoBadgeProps {
	className?: string;
}

/** Visible marker that the current answer came from the curated Demo Archive. */
export default function DemoBadge({
	className = "",
}: DemoBadgeProps): React.ReactElement {
	const t = useTranslations("Demo");
	return (
		<output
			title={t("badgeTooltip")}
			className={`inline-flex items-center gap-1.5 text-[10px] font-mono-tabular px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--accent-terracotta)] text-[var(--accent-terracotta)] ${className}`}
		>
			<BookMarked className="w-3 h-3" aria-hidden="true" />
			{t("badge")}
		</output>
	);
}
