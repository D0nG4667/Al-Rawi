"use client";

import { BookOpen, ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUIStore } from "@/store/useUIStore";

interface PersonaSelectorProps {
	compact?: boolean;
}

export default function PersonaSelector({
	compact = false,
}: PersonaSelectorProps): React.ReactElement {
	const t = useTranslations("Dashboard");
	const persona = useUIStore((state) => state.persona);
	const setPersona = useUIStore((state) => state.setPersona);

	return (
		<div className={compact ? "inline-flex" : "flex flex-col gap-1.5 w-full"}>
			{!compact && (
				<span className="text-[11px] font-mono-tabular uppercase tracking-wider text-[var(--text-secondary)]">
					Guide Persona
				</span>
			)}
			<div className="inline-grid grid-cols-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-1 gap-1">
				<button
					type="button"
					onClick={() => setPersona("STORYTELLER")}
					className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
						persona === "STORYTELLER"
							? "heritage-chip font-semibold shadow-sm"
							: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
					}`}
				>
					<ScrollText className="w-3.5 h-3.5 shrink-0" />
					<span className="truncate">{t("personaStoryteller")}</span>
				</button>
				<button
					type="button"
					onClick={() => setPersona("ACADEMIC")}
					className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
						persona === "ACADEMIC"
							? "heritage-chip font-semibold shadow-sm"
							: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
					}`}
				>
					<BookOpen className="w-3.5 h-3.5 shrink-0" />
					<span className="truncate">{t("personaAcademic")}</span>
				</button>
			</div>
		</div>
	);
}
