"use client";

import { motion, useReducedMotion } from "framer-motion";
import type React from "react";

interface RevealProps {
	children: React.ReactNode;
	delay?: number;
	className?: string;
}

/** Scroll-triggered fade-up for below-the-fold sections; static under reduced motion. */
export default function Reveal({
	children,
	delay = 0,
	className,
}: RevealProps): React.ReactElement {
	const prefersReducedMotion = useReducedMotion();
	if (prefersReducedMotion) {
		return <div className={className}>{children}</div>;
	}
	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-80px" }}
			transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
		>
			{children}
		</motion.div>
	);
}
