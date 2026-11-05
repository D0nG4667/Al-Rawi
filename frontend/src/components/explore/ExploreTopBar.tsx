"use client";

import {
	Archive,
	Compass,
	MapPin,
	Moon,
	ScrollText,
	Sparkles,
	Sun,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type React from "react";
import DemoBadge from "@/components/explore/DemoBadge";
import HeritageOrnament from "@/components/ui/HeritageOrnament";
import PersonaSelector from "@/components/ui/PersonaSelector";
import {
	HERITAGE_SITES,
	type HeritageSiteId,
	useUIStore,
} from "@/store/useUIStore";

interface ExploreTopBarProps {
	locale: string;
	isDemo: boolean;
	uploadedCount: number;
	messageCount: number;
	onOpenMap: () => void;
	onSummonMajlis: () => void;
	onInteractionSound: () => void;
}

const SITE_ORDER: HeritageSiteId[] = ["diriyah", "hegra", "jeddah"];

export default function ExploreTopBar({
	locale,
	isDemo,
	uploadedCount,
	messageCount,
	onOpenMap,
	onSummonMajlis,
	onInteractionSound,
}: ExploreTopBarProps): React.ReactElement {
	const tCommon = useTranslations("Common");
	const tDash = useTranslations("Dashboard");

	const theme = useUIStore((state) => state.theme);
	const toggleTheme = useUIStore((state) => state.toggleTheme);
	const activeSite = useUIStore((state) => state.activeSite);
	const setActiveSite = useUIStore((state) => state.setActiveSite);
	const activeDrawer = useUIStore((state) => state.activeDrawer);
	const setActiveDrawer = useUIStore((state) => state.setActiveDrawer);

	const switchLocale = locale === "en" ? "ar" : "en";
	const switchLabel = locale === "en" ? "العربية" : "English";
	const currentSiteMeta = HERITAGE_SITES[activeSite];

	const handleToggleDrawer = (target: "archive" | "oracle"): void => {
		onInteractionSound();
		setActiveDrawer(activeDrawer === target ? null : target);
	};

	const handleSelectSite = (siteId: HeritageSiteId): void => {
		onInteractionSound();
		setActiveSite(siteId);
	};

	return (
		<header className="w-full max-w-7xl mx-auto pointer-events-auto">
			<div className="glass-panel px-4 py-3 flex flex-wrap items-center justify-between gap-3">
				{/* Brand & Active Geofence Telemetry */}
				<div className="flex items-center gap-3">
					<div className="p-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
						<HeritageOrnament variant="astrolabe" className="w-7 h-7" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h1 className="text-lg font-display font-bold tracking-wide text-[var(--text-primary)]">
								{tCommon("title")}
							</h1>
							{isDemo ? (
								<DemoBadge className="hidden sm:inline-flex" />
							) : (
								<span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono-tabular px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--accent-oasis)]">
									<span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-oasis)] animate-pulse" />
									{tCommon("oracleStatus")}
								</span>
							)}
						</div>
						<p className="text-[11px] text-[var(--text-secondary)] hidden sm:block">
							{tCommon("subtitle")}
						</p>
					</div>
				</div>

				{/* UNESCO Site Teleporter Pills */}
				<nav
					aria-label="UNESCO World Heritage Sites"
					className="hidden lg:flex items-center gap-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-1"
				>
					{SITE_ORDER.map((siteId) => {
						const site = HERITAGE_SITES[siteId];
						const isActive = activeSite === siteId;
						const label = locale === "ar" ? site.titleAr : site.titleEn;
						return (
							<button
								key={siteId}
								type="button"
								onClick={() => handleSelectSite(siteId)}
								className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
									isActive
										? "heritage-chip font-semibold shadow-sm"
										: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
								}`}
							>
								<MapPin className="w-3.5 h-3.5 shrink-0" />
								<span>{label}</span>
							</button>
						);
					})}
					<span className="px-2.5 text-[10px] font-mono-tabular text-[var(--text-muted)] border-s border-[var(--border-subtle)]">
						{currentSiteMeta.coordinatesLabel}
					</span>
				</nav>

				{/* Right Controls: Persona, Drawers, Map, Majlis, Theme, Locale */}
				<div className="flex items-center gap-2 flex-wrap">
					<div className="hidden xl:block">
						<PersonaSelector compact />
					</div>

					{/* Archive Sheet Toggle */}
					<button
						type="button"
						onClick={() => handleToggleDrawer("archive")}
						aria-expanded={activeDrawer === "archive"}
						className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
							activeDrawer === "archive"
								? "heritage-chip font-semibold"
								: "bg-[var(--bg-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-primary)]"
						}`}
					>
						<Archive className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
						<span className="hidden md:inline">{tDash("archiveTrigger")}</span>
						<span className="text-[10px] font-mono-tabular px-1.5 py-0.2 rounded-full bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]">
							{uploadedCount + 3}
						</span>
					</button>

					{/* Oracle Chronicle Sheet Toggle */}
					<button
						type="button"
						onClick={() => handleToggleDrawer("oracle")}
						aria-expanded={activeDrawer === "oracle"}
						className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
							activeDrawer === "oracle"
								? "heritage-chip font-semibold"
								: "bg-[var(--bg-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-primary)]"
						}`}
					>
						<ScrollText className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
						<span className="hidden md:inline">{tDash("oracleTrigger")}</span>
						{messageCount > 0 && (
							<span className="text-[10px] font-mono-tabular px-1.5 py-0.2 rounded-full bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]">
								{messageCount}
							</span>
						)}
					</button>

					{/* Knowledge Graph Trigger */}
					<button
						type="button"
						onClick={onOpenMap}
						className="px-3 py-2 rounded-xl text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-primary)] transition-all flex items-center gap-1.5 cursor-pointer"
						title={tDash("viewMap")}
					>
						<Compass className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
						<span className="hidden sm:inline">{tDash("viewMap")}</span>
					</button>

					{/* Majlis Audio Studio Trigger */}
					<button
						type="button"
						onClick={onSummonMajlis}
						className="px-3 py-2 rounded-xl text-xs font-semibold heritage-chip transition-all flex items-center gap-1.5 cursor-pointer"
					>
						<Sparkles className="w-3.5 h-3.5" />
						<span className="hidden sm:inline">{tDash("majlisTrigger")}</span>
					</button>

					{/* Dual Heritage Theme Switcher */}
					<button
						type="button"
						onClick={() => {
							onInteractionSound();
							toggleTheme();
						}}
						aria-label={
							theme === "night"
								? tCommon("themeSandstone")
								: tCommon("themeNight")
						}
						title={
							theme === "night"
								? tCommon("themeSandstone")
								: tCommon("themeNight")
						}
						className="p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--accent-gold)] transition-all cursor-pointer"
					>
						{theme === "night" ? (
							<Sun className="w-4 h-4" />
						) : (
							<Moon className="w-4 h-4" />
						)}
					</button>

					{/* Locale Switcher */}
					<a
						href={`/${switchLocale}/explore`}
						className="text-xs bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-xl px-3 py-2 text-[var(--text-primary)] transition-all font-semibold"
					>
						{switchLabel}
					</a>
				</div>
			</div>
		</header>
	);
}
