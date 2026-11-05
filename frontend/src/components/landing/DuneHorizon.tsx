import type React from "react";

interface DuneHorizonProps {
	className?: string;
}

/** Layered SVG dune silhouette tinted by the active heritage theme. */
export default function DuneHorizon({
	className,
}: DuneHorizonProps): React.ReactElement {
	return (
		<svg
			className={className}
			viewBox="0 0 1440 240"
			preserveAspectRatio="none"
			aria-hidden="true"
			focusable="false"
		>
			<path
				d="M0 160 C 240 100, 420 190, 720 140 S 1200 90, 1440 150 L1440 240 L0 240 Z"
				fill="var(--accent-gold)"
				opacity="0.08"
			/>
			<path
				d="M0 190 C 300 140, 560 220, 860 175 S 1260 150, 1440 185 L1440 240 L0 240 Z"
				fill="var(--accent-terracotta)"
				opacity="0.12"
			/>
			<path
				d="M0 215 C 260 190, 620 240, 980 205 S 1320 200, 1440 212 L1440 240 L0 240 Z"
				fill="var(--bg-canvas)"
			/>
		</svg>
	);
}
