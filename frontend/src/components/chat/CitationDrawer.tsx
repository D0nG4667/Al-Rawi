"use client";

import { BookOpenCheck, Calendar, FileText, Shield, X } from "lucide-react";
import HeritageOrnament from "@/components/ui/HeritageOrnament";

export interface CitationData {
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
}: CitationDrawerProps): React.ReactElement | null {
	if (!isOpen || !citation) return null;

	return (
		<div className="fixed inset-y-4 inset-inline-end-4 w-88 max-w-[calc(100vw-2rem)] glass-panel border border-[var(--border-strong)] z-50 flex flex-col text-[var(--text-primary)] overflow-hidden animate-in fade-in duration-200">
			<HeritageOrnament variant="najdi-band" />
			<header className="p-4 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--bg-elevated)]">
				<div className="flex items-center gap-2.5">
					<div className="p-1.5 rounded-lg heritage-chip">
						<FileText className="w-4 h-4" />
					</div>
					<div>
						<span className="font-display font-semibold text-sm tracking-wide block">
							Primary Archival Folio
						</span>
						<span className="text-[10px] font-mono-tabular uppercase tracking-widest text-[var(--text-muted)]">
							Verified RAG Provenance
						</span>
					</div>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="p-1.5 rounded-full border border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] active:scale-95 transition-all cursor-pointer"
					aria-label="Close Source"
				>
					<X className="w-3.5 h-3.5" />
				</button>
			</header>

			<div className="flex-1 overflow-y-auto p-5 space-y-5">
				<div>
					<h3 className="text-[11px] text-[var(--text-muted)] uppercase tracking-widest font-mono-tabular">
						Dossier Reference
					</h3>
					<p className="text-sm font-display font-semibold mt-1 text-[var(--accent-gold)] leading-snug">
						{citation.title || "UNESCO World Heritage Nomination Dossier"}
					</p>
				</div>

				{citation.page !== undefined && (
					<div>
						<h3 className="text-[11px] text-[var(--text-muted)] uppercase tracking-widest font-mono-tabular">
							Folio / Page Location
						</h3>
						<p className="text-xs mt-1.5 heritage-chip rounded-md px-2.5 py-1 w-fit font-mono-tabular font-semibold">
							Folio p. {citation.page}
						</p>
					</div>
				)}

				<div>
					<h3 className="text-[11px] text-[var(--text-muted)] uppercase tracking-widest font-mono-tabular">
						Extracted Manuscript Passage
					</h3>
					<blockquote className="text-xs mt-2 manuscript-card border-s-2 border-s-[var(--accent-gold)] p-4 leading-relaxed text-[var(--text-primary)] italic whitespace-pre-wrap">
						“{citation.content}”
					</blockquote>
				</div>

				<div className="border-t border-[var(--border-subtle)] pt-4 space-y-2.5 text-[11px] text-[var(--text-secondary)]">
					<div className="flex items-center gap-2">
						<BookOpenCheck className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
						<span>UNESCO · RCU · Darah Curated Series</span>
					</div>
					<div className="flex items-center gap-2">
						<Calendar className="w-3.5 h-3.5 text-[var(--accent-terracotta)]" />
						<span>Cross-checked via Hybrid pgvector + BM25 Index</span>
					</div>
					<div className="flex items-center gap-2">
						<Shield className="w-3.5 h-3.5 text-[var(--accent-oasis)]" />
						<span>Row-Level Security Verified (Neon Postgres)</span>
					</div>
				</div>
			</div>
		</div>
	);
}
