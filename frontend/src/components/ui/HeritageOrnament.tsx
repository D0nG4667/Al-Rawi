"use client";

import type React from "react";

interface HeritageOrnamentProps {
	variant: "najdi-band" | "corner-rosette" | "astrolabe";
	className?: string;
}

/**
 * Architectural & calligraphic geometric SVG ornaments inspired by
 * Najdi mud-brick furjat friezes, Nabataean stone rosettes, and brass astrolabes.
 */
export default function HeritageOrnament({
	variant,
	className = "",
}: HeritageOrnamentProps): React.ReactElement {
	if (variant === "najdi-band") {
		return (
			<div
				aria-hidden="true"
				className={`w-full overflow-hidden select-none pointer-events-none opacity-45 ${className}`}
			>
				<svg
					viewBox="0 0 480 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="w-full h-3 text-[var(--accent-gold)]"
					preserveAspectRatio="none"
				>
					<title>Najdi geometric frieze</title>
					<path
						d="M0 13H480M0 1H480"
						stroke="currentColor"
						strokeOpacity="0.4"
						strokeWidth="0.75"
					/>
					{Array.from({ length: 24 }).map((_, idx) => {
						const x = idx * 20;
						return (
							<polygon
								key={`tri-${x}`}
								points={`${x + 2},11 ${x + 10},3 ${x + 18},11`}
								fill="currentColor"
								fillOpacity={idx % 2 === 0 ? "0.45" : "0.2"}
							/>
						);
					})}
				</svg>
			</div>
		);
	}

	if (variant === "corner-rosette") {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className={`w-4 h-4 text-[var(--accent-gold)] select-none pointer-events-none ${className}`}
			>
				<title>Nabataean rosette</title>
				<rect
					x="3"
					y="3"
					width="18"
					height="18"
					transform="rotate(45 12 12)"
					stroke="currentColor"
					strokeWidth="1.2"
					strokeOpacity="0.55"
				/>
				<rect
					x="5.5"
					y="5.5"
					width="13"
					height="13"
					stroke="currentColor"
					strokeWidth="1.2"
					strokeOpacity="0.75"
				/>
				<circle cx="12" cy="12" r="2.2" fill="currentColor" />
			</svg>
		);
	}

	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 40 40"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`w-8 h-8 text-[var(--accent-gold)] select-none pointer-events-none ${className}`}
		>
			<title>Celestial Astrolabe Emblem</title>
			<circle
				cx="20"
				cy="20"
				r="17"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeOpacity="0.8"
			/>
			<circle
				cx="20"
				cy="20"
				r="12.5"
				stroke="currentColor"
				strokeWidth="1"
				strokeDasharray="2.5 2.5"
				strokeOpacity="0.6"
			/>
			<circle
				cx="20"
				cy="16.5"
				r="7.5"
				stroke="currentColor"
				strokeWidth="1.1"
				strokeOpacity="0.75"
			/>
			<path
				d="M20 2V38M2 20H38M7.5 7.5L32.5 32.5M32.5 7.5L7.5 32.5"
				stroke="currentColor"
				strokeWidth="0.9"
				strokeOpacity="0.45"
			/>
			<circle cx="20" cy="20" r="2.4" fill="currentColor" />
		</svg>
	);
}
