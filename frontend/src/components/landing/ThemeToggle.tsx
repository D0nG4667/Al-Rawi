"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import type React from "react";
import { useUIStore } from "@/store/useUIStore";

export default function ThemeToggle(): React.ReactElement {
	const t = useTranslations("Common");
	const theme = useUIStore((state) => state.theme);
	const toggleTheme = useUIStore((state) => state.toggleTheme);
	const label = theme === "night" ? t("themeSandstone") : t("themeNight");

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label={label}
			title={label}
			className="p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--accent-gold)] transition-all cursor-pointer"
		>
			{theme === "night" ? (
				<Sun className="w-4 h-4" aria-hidden="true" />
			) : (
				<Moon className="w-4 h-4" aria-hidden="true" />
			)}
		</button>
	);
}
