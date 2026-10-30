"use client";

import { Eye, Sparkles } from "lucide-react";
import { useState } from "react";
import HeritageOrnament from "@/components/ui/HeritageOrnament";
import {
	type ArchitecturalHotspot,
	HERITAGE_SITES,
	useUIStore,
} from "@/store/useUIStore";

interface SiteHotspotBarProps {
	locale: string;
	onAskHotspot: (inquiry: string) => void;
	onInteractionSound: () => void;
}

/**
 * Interactive Architectural Anatomy & Camera Waypoint inspector.
 * Flies the 3D camera to specific structural features of the active UNESCO
 * site and offers a one-click archival inquiry to the AI Oracle.
 */
export default function SiteHotspotBar({
	locale,
	onAskHotspot,
	onInteractionSound,
}: SiteHotspotBarProps): React.ReactElement | null {
	const activeSite = useUIStore((state) => state.activeSite);
	const activeDrawer = useUIStore((state) => state.activeDrawer);
	const setFocusNode = useUIStore((state) => state.setFocusNode);

	const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(
		null,
	);

	// Hide when mobile/desktop side drawers occupy the viewport
	if (activeDrawer !== null) return null;

	const siteMeta = HERITAGE_SITES[activeSite];
	const isAr = locale === "ar";
	const eraLabel = isAr ? siteMeta.eraAr : siteMeta.eraEn;
	const siteTitle = isAr ? siteMeta.titleAr : siteMeta.titleEn;

	const activeHotspot: ArchitecturalHotspot =
		siteMeta.hotspots.find((h) => h.id === selectedHotspotId) ||
		siteMeta.hotspots[0];

	const handleSelectHotspot = (hotspot: ArchitecturalHotspot): void => {
		onInteractionSound();
		setSelectedHotspotId(hotspot.id);
		setFocusNode(activeSite, hotspot.coords);
	};

	return (
		<aside
			aria-label="Architectural Anatomy Waypoints"
			className="hidden lg:flex flex-col gap-2.5 w-80 pointer-events-auto"
		>
			<div className="glass-panel p-4 space-y-3 border border-[var(--border-subtle)]">
				<div className="flex items-start justify-between gap-2">
					<div>
						<span className="text-[10px] font-mono-tabular uppercase tracking-widest text-[var(--accent-gold)] block">
							{eraLabel}
						</span>
						<h2 className="font-display font-bold text-sm text-[var(--text-primary)] mt-0.5 flex items-center gap-1.5">
							<HeritageOrnament
								variant="corner-rosette"
								className="w-3.5 h-3.5"
							/>
							{siteTitle}
						</h2>
					</div>
					<span className="text-[10px] font-mono-tabular text-[var(--text-muted)]">
						3D Waypoints
					</span>
				</div>

				{/* Camera Waypoint Pills */}
				<div className="flex flex-col gap-1.5">
					{siteMeta.hotspots.map((hotspot, idx) => {
						const isSelected = activeHotspot.id === hotspot.id;
						const label = isAr ? hotspot.labelAr : hotspot.labelEn;
						const detail = isAr ? hotspot.detailAr : hotspot.detailEn;

						return (
							<div
								key={hotspot.id}
								className={`manuscript-card p-2.5 transition-all ${
									isSelected ? "border-[var(--border-strong)]" : ""
								}`}
							>
								<div className="flex items-center justify-between gap-2">
									<button
										type="button"
										onClick={() => handleSelectHotspot(hotspot)}
										className="flex-1 text-start flex items-center gap-2 cursor-pointer"
									>
										<span className="text-[10px] font-mono-tabular px-1.5 py-0.5 rounded heritage-chip font-bold">
											0{idx + 1}
										</span>
										<span className="text-xs font-semibold text-[var(--text-primary)]">
											{label}
										</span>
									</button>
									<Eye className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
								</div>

								{isSelected && (
									<div className="mt-2 pt-2 border-t border-[var(--border-subtle)] space-y-2">
										<p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
											{detail}
										</p>
										<button
											type="button"
											onClick={() =>
												onAskHotspot(
													isAr ? hotspot.inquiryAr : hotspot.inquiryEn,
												)
											}
											className="w-full heritage-chip rounded-lg px-2.5 py-1.5 text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
										>
											<Sparkles className="w-3 h-3" />
											<span>
												{isAr
													? "اسأل الراوي عن هذا العنصر"
													: "Consult Oracle on this Feature"}
											</span>
										</button>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</aside>
	);
}
