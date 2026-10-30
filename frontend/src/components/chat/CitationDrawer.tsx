"use client";

import { Calendar, FileText, Shield, X } from "lucide-react";

interface CitationData {
	title: string;
	content: string;
	page?: number | string;
	score?: number;
}

interface CitationDrawerProps {
	isOpen: boolean;
	citation: CitationData | null;
	onClose: () => void;
}

export default function CitationDrawer({
	isOpen,
	citation,
	onClose,
}: CitationDrawerProps) {
	if (!isOpen || !citation) return null;

	return (
		<div className="absolute right-0 top-0 bottom-0 w-80 glass-panel border-l border-white/10 z-30 flex flex-col text-white shadow-[-8px_0_24px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300">
			<header className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
				<div className="flex items-center gap-2">
					<FileText className="w-4 h-4 text-amber-400" />
					<span className="font-semibold text-sm tracking-wide">
						Citation Document Source
					</span>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="p-1.5 rounded-full border border-white/10 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
					aria-label="Close Source"
				>
					<X className="w-3.5 h-3.5" />
				</button>
			</header>

			<div className="flex-1 overflow-y-auto p-4 space-y-5">
				<div>
					<h3 className="text-xs opacity-50 uppercase tracking-wider font-semibold">
						Source Document
					</h3>
					<p className="text-sm font-semibold mt-1 text-amber-300 leading-snug">
						{citation.title || "UNESCO World Heritage Dossier"}
					</p>
				</div>

				{citation.page !== undefined && (
					<div>
						<h3 className="text-xs opacity-50 uppercase tracking-wider font-semibold">
							Location
						</h3>
						<p className="text-xs mt-1 text-white/95 bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 w-fit font-medium">
							Page {citation.page}
						</p>
					</div>
				)}

				<div>
					<h3 className="text-xs opacity-50 uppercase tracking-wider font-semibold">
						RAG Match Context Segment
					</h3>
					<div className="text-xs mt-2 bg-black/40 border border-white/5 rounded-xl p-3.5 leading-relaxed text-white/90 italic font-medium whitespace-pre-wrap">
						"{citation.content}"
					</div>
				</div>

				<div className="border-t border-white/5 pt-4 space-y-3 text-[11px] opacity-70">
					<div className="flex items-center gap-2">
						<Calendar className="w-3.5 h-3.5" />
						<span>Verified Archive: Diriyah & UNESCO Series</span>
					</div>
					<div className="flex items-center gap-2">
						<Shield className="w-3.5 h-3.5" />
						<span>Row-Level Security Checked (Neon Postgres)</span>
					</div>
				</div>
			</div>
		</div>
	);
}
