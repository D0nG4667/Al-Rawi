"use client";

import { useTranslations } from "next-intl";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import HeritageOrnament from "@/components/ui/HeritageOrnament";
import type { GuidedTourState } from "@/hooks/useGuidedTour";
import { TOUR_STEPS } from "@/lib/tourSteps";

interface GuidedTourProps {
	tour: GuidedTourState;
	onAskForMe: () => void;
}

const SPOTLIGHT_PADDING = 8;
const CARD_GAP = 16;
/** Frames to wait for an anchor: ~0.5 s normally, ~10 s for the answer citation. */
const ANCHOR_WAIT_FRAMES = { default: 30, citation: 600 } as const;

function findAnchor(anchor: string): HTMLElement | null {
	const element = document.querySelector<HTMLElement>(
		`[data-tour="${anchor}"]`,
	);
	return element && element.getClientRects().length > 0 ? element : null;
}

function cardPosition(rect: DOMRect | null): React.CSSProperties {
	if (!rect) {
		return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
	}
	const cardWidth = Math.min(352, window.innerWidth - 32);
	const left = Math.min(
		Math.max(16, rect.left + rect.width / 2 - cardWidth / 2),
		window.innerWidth - cardWidth - 16,
	);
	const spaceBelow = window.innerHeight - rect.bottom;
	return spaceBelow > 240
		? { top: rect.bottom + CARD_GAP, left }
		: { bottom: window.innerHeight - rect.top + CARD_GAP, left };
}

export default function GuidedTour({
	tour,
	onAskForMe,
}: GuidedTourProps): React.ReactElement | null {
	const t = useTranslations("Tour");
	const step = TOUR_STEPS[tour.stepIndex];
	const [rect, setRect] = useState<DOMRect | null>(null);
	const cardRef = useRef<HTMLDivElement | null>(null);
	const primaryRef = useRef<HTMLButtonElement | null>(null);
	const { isActive, next, skip, back } = tour;

	// Locate the anchor; skip the step quietly if it never appears.
	useEffect(() => {
		if (!isActive || !step) return;
		let frame = 0;
		let attempts = 0;
		const limit =
			step.anchor === "citation-chip"
				? ANCHOR_WAIT_FRAMES.citation
				: ANCHOR_WAIT_FRAMES.default;
		setRect(null);
		const locate = (): void => {
			const element = findAnchor(step.anchor);
			if (element) {
				setRect(element.getBoundingClientRect());
				return;
			}
			attempts += 1;
			if (attempts > limit) {
				next();
				return;
			}
			frame = requestAnimationFrame(locate);
		};
		locate();
		return () => cancelAnimationFrame(frame);
	}, [isActive, step, next]);

	// Keep the spotlight aligned on resize and scroll.
	useEffect(() => {
		if (!isActive || !step) return;
		const update = (): void => {
			const element = findAnchor(step.anchor);
			if (element) setRect(element.getBoundingClientRect());
		};
		window.addEventListener("resize", update);
		window.addEventListener("scroll", update, true);
		return () => {
			window.removeEventListener("resize", update);
			window.removeEventListener("scroll", update, true);
		};
	}, [isActive, step]);

	// Focus the primary action whenever the step changes.
	useEffect(() => {
		if (isActive && step) primaryRef.current?.focus();
	}, [isActive, step]);

	// Keyboard: Esc skips, arrows move (mirrored in RTL), Tab stays inside the card.
	useEffect(() => {
		if (!isActive) return;
		const onKeyDown = (event: KeyboardEvent): void => {
			const isRtl = document.documentElement.dir === "rtl";
			const forwardKey = isRtl ? "ArrowLeft" : "ArrowRight";
			const backwardKey = isRtl ? "ArrowRight" : "ArrowLeft";
			if (event.key === "Escape") {
				event.preventDefault();
				event.stopPropagation();
				skip();
			} else if (event.key === forwardKey && step?.id !== "ask") {
				event.preventDefault();
				next();
			} else if (event.key === backwardKey) {
				event.preventDefault();
				back();
			} else if (event.key === "Tab" && cardRef.current) {
				const focusables = Array.from(
					cardRef.current.querySelectorAll<HTMLButtonElement>("button"),
				);
				const first = focusables[0];
				const last = focusables[focusables.length - 1];
				if (event.shiftKey && document.activeElement === first) {
					event.preventDefault();
					last?.focus();
				} else if (!event.shiftKey && document.activeElement === last) {
					event.preventDefault();
					first?.focus();
				}
			}
		};
		window.addEventListener("keydown", onKeyDown, true);
		return () => window.removeEventListener("keydown", onKeyDown, true);
	}, [isActive, step, next, back, skip]);

	if (!isActive || !step) return null;

	const isLast = tour.stepIndex === TOUR_STEPS.length - 1;
	const isWaiting = step.anchor === "citation-chip" && rect === null;
	const spotlightStyle: React.CSSProperties | null = rect
		? {
				top: rect.top - SPOTLIGHT_PADDING,
				left: rect.left - SPOTLIGHT_PADDING,
				width: rect.width + SPOTLIGHT_PADDING * 2,
				height: rect.height + SPOTLIGHT_PADDING * 2,
			}
		: null;
	const secondaryButtonClass =
		"px-3 py-1.5 rounded-lg text-xs border border-[var(--border-subtle)] hover:border-[var(--border-strong)] cursor-pointer";
	const primaryButtonClass =
		"px-3 py-1.5 rounded-lg text-xs font-semibold heritage-chip cursor-pointer";

	return (
		<div className="fixed inset-0 z-[60] pointer-events-none">
			{spotlightStyle ? (
				<div
					aria-hidden="true"
					className="tour-spotlight absolute rounded-2xl"
					style={spotlightStyle}
				/>
			) : (
				<div aria-hidden="true" className="absolute inset-0 bg-black/55" />
			)}
			<div
				ref={cardRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="tour-title"
				aria-describedby="tour-body"
				className="absolute pointer-events-auto glass-panel border border-[var(--border-strong)] w-[min(22rem,calc(100vw-2rem))] overflow-hidden"
				style={cardPosition(rect)}
			>
				<HeritageOrnament variant="najdi-band" />
				<div className="p-4 space-y-3">
					<p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[var(--accent-gold)]">
						{t("stepCounter", {
							current: String(tour.stepIndex + 1),
							total: String(TOUR_STEPS.length),
						})}
					</p>
					<h2 id="tour-title" className="font-display font-bold text-base">
						{t(step.titleKey)}
					</h2>
					<p
						id="tour-body"
						aria-live="polite"
						className="text-sm text-[var(--text-secondary)] leading-relaxed"
					>
						{isWaiting ? t("waiting") : t(step.bodyKey)}
					</p>
					<div className="flex items-center justify-between gap-2 pt-1">
						<button
							type="button"
							onClick={skip}
							className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
						>
							{t("skip")}
						</button>
						<div className="flex items-center gap-2">
							{tour.stepIndex > 0 && (
								<button
									type="button"
									onClick={back}
									className={secondaryButtonClass}
								>
									{t("back")}
								</button>
							)}
							{step.id === "ask" ? (
								<>
									<button
										type="button"
										onClick={next}
										className={secondaryButtonClass}
									>
										{t("next")}
									</button>
									<button
										ref={primaryRef}
										type="button"
										onClick={() => {
											onAskForMe();
											next();
										}}
										className={primaryButtonClass}
									>
										{t("askForMe")}
									</button>
								</>
							) : (
								<button
									ref={primaryRef}
									type="button"
									onClick={next}
									className={primaryButtonClass}
								>
									{isLast ? t("finish") : t("next")}
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
