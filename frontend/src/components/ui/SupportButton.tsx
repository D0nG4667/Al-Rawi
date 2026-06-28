"use client";

import { Heart } from "lucide-react";

export default function SupportButton() {
	const donationLink = process.env.NEXT_PUBLIC_DONATION_LINK || "#";

	return (
		<a
			href={donationLink}
			target="_blank"
			rel="noopener noreferrer"
			className="absolute bottom-6 left-6 z-50 glass-panel px-4 py-2 flex items-center gap-2 hover:bg-white/10 transition-colors pointer-events-auto"
		>
			<Heart className="w-4 h-4 text-rose-500 animate-pulse" />
			<span className="text-sm font-medium">Support Al-Rawi</span>
		</a>
	);
}
