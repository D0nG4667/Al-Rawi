"use client";

import { type ReactNode, useEffect } from "react";
import { type HeritageTheme, useUIStore } from "@/store/useUIStore";

const THEME_STORAGE_KEY = "al-rawi-theme";

interface ThemeProviderProps {
	children: ReactNode;
}

export default function ThemeProvider({
	children,
}: ThemeProviderProps): React.ReactElement {
	const theme = useUIStore((state) => state.theme);
	const setTheme = useUIStore((state) => state.setTheme);

	// Initialize from localStorage or prefers-color-scheme on mount
	useEffect(() => {
		try {
			const stored = window.localStorage.getItem(
				THEME_STORAGE_KEY,
			) as HeritageTheme | null;
			if (stored === "night" || stored === "sandstone") {
				setTheme(stored);
				document.documentElement.setAttribute("data-theme", stored);
				return;
			}
			const prefersLight = window.matchMedia(
				"(prefers-color-scheme: light)",
			).matches;
			const resolved: HeritageTheme = prefersLight ? "sandstone" : "night";
			setTheme(resolved);
			document.documentElement.setAttribute("data-theme", resolved);
		} catch {
			document.documentElement.setAttribute("data-theme", "night");
		}
	}, [setTheme]);

	// Synchronize DOM attribute and localStorage when theme changes
	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		try {
			window.localStorage.setItem(THEME_STORAGE_KEY, theme);
		} catch {
			// Ignore storage quota or private mode restrictions
		}
	}, [theme]);

	return <>{children}</>;
}
