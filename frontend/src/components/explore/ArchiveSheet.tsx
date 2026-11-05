"use client";

import {
	Archive,
	BookMarked,
	CheckCircle2,
	MapPin,
	UploadCloud,
	X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { type ChangeEvent, type DragEvent, useRef } from "react";
import type { UploadedDoc } from "@/components/explore/types";
import DocumentRequestForm from "@/components/ui/DocumentRequestForm";
import HeritageOrnament from "@/components/ui/HeritageOrnament";
import {
	HERITAGE_SITES,
	type HeritageSiteId,
	useUIStore,
} from "@/store/useUIStore";

interface ArchiveSheetProps {
	locale: string;
	isOpen: boolean;
	uploadedDocs: UploadedDoc[];
	isUploading: boolean;
	uploadError: string;
	apiKey: string;
	onClose: () => void;
	onFileUpload: (file: File) => void;
	onAskDossier: (prompt: string) => void;
}

const SITE_KEYS: HeritageSiteId[] = ["diriyah", "hegra", "jeddah"];

export default function ArchiveSheet({
	locale,
	isOpen,
	uploadedDocs,
	isUploading,
	uploadError,
	apiKey,
	onClose,
	onFileUpload,
	onAskDossier,
}: ArchiveSheetProps): React.ReactElement | null {
	const tDash = useTranslations("Dashboard");
	const activeSite = useUIStore((state) => state.activeSite);
	const setActiveSite = useUIStore((state) => state.setActiveSite);
	const persona = useUIStore((state) => state.persona);

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	if (!isOpen) return null;

	const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const selected = e.target.files?.[0];
		if (selected) {
			onFileUpload(selected);
		}
		e.target.value = "";
	};

	const handleDrop = (e: DragEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		const dropped = e.dataTransfer.files?.[0];
		if (dropped) {
			onFileUpload(dropped);
		}
	};

	return (
		<aside
			aria-label={tDash("archiveTrigger")}
			className="fixed inset-x-3 bottom-3 top-24 md:inset-y-24 md:start-6 md:end-auto md:w-[400px] z-30 glass-panel border border-[var(--border-strong)] flex flex-col pointer-events-auto overflow-hidden animate-in fade-in duration-200"
		>
			<HeritageOrnament variant="najdi-band" />

			{/* Header */}
			<header className="px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<div className="p-2 rounded-xl heritage-chip">
						<Archive className="w-4 h-4" />
					</div>
					<div>
						<h2 className="font-display font-bold text-base tracking-wide">
							{tDash("archiveTrigger")}
						</h2>
						<p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[var(--text-muted)]">
							UNESCO · RCU · Darah Corpus
						</p>
					</div>
				</div>
				<button
					type="button"
					onClick={onClose}
					aria-label="Close Archive Drawer"
					className="p-1.5 rounded-full border border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] transition-all cursor-pointer"
				>
					<X className="w-4 h-4" />
				</button>
			</header>

			{/* Body */}
			<div className="flex-1 overflow-y-auto p-5 space-y-6">
				{/* Section 1: Curated UNESCO & RCU Reference Dossiers */}
				<section className="space-y-2.5">
					<h3 className="text-[11px] font-mono-tabular uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-1.5">
						<BookMarked className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
						{tDash("curatedDossiersTitle")}
					</h3>
					<div className="space-y-2">
						{SITE_KEYS.map((siteId) => {
							const site = HERITAGE_SITES[siteId];
							const isSelected = activeSite === siteId;
							const title = locale === "ar" ? site.titleAr : site.titleEn;
							const region = locale === "ar" ? site.regionAr : site.regionEn;
							const samplePrompt =
								site.prompts[persona][locale === "ar" ? "ar" : "en"][0];

							return (
								<div
									key={siteId}
									className={`manuscript-card p-3.5 flex flex-col gap-2 ${
										isSelected ? "border-[var(--border-strong)]" : ""
									}`}
								>
									<div className="flex items-start justify-between gap-2">
										<div>
											<div className="text-xs font-display font-bold text-[var(--text-primary)] flex items-center gap-1.5">
												<HeritageOrnament
													variant="corner-rosette"
													className="w-3 h-3"
												/>
												{title}
											</div>
											<div className="text-[10px] font-mono-tabular text-[var(--accent-gold)] mt-0.5">
												{site.unescoRef} · {region}
											</div>
										</div>
										<button
											type="button"
											onClick={() => setActiveSite(siteId)}
											className={`text-[10px] font-mono-tabular px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
												isSelected
													? "heritage-chip font-semibold"
													: "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
											}`}
										>
											<MapPin className="w-3 h-3" />
											{isSelected ? "Active" : "Focus 3D"}
										</button>
									</div>

									<button
										type="button"
										onClick={() => {
											setActiveSite(siteId);
											onAskDossier(samplePrompt);
										}}
										className="text-start text-[11px] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors line-clamp-2 cursor-pointer"
									>
										“{samplePrompt}”
									</button>
								</div>
							);
						})}
					</div>
				</section>

				{/* Section 2: Custom PDF Scroll Upload */}
				<section className="space-y-3 border-t border-[var(--border-subtle)] pt-5">
					<h3 className="text-[11px] font-mono-tabular uppercase tracking-widest text-[var(--text-secondary)]">
						{tDash("customIngestionTitle")}
					</h3>

					<input
						ref={fileInputRef}
						type="file"
						accept=".pdf,application/pdf"
						onChange={handleFileInputChange}
						className="hidden"
					/>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						onDragOver={(e) => e.preventDefault()}
						onDrop={handleDrop}
						disabled={isUploading || uploadedDocs.length >= 5}
						className="w-full manuscript-card border-dashed border-[var(--border-strong)] p-5 flex flex-col items-center justify-center text-center hover:bg-[var(--accent-gold-soft)] transition-all cursor-pointer disabled:opacity-40"
					>
						<UploadCloud className="w-7 h-7 mb-2 text-[var(--accent-gold)]" />
						<span className="text-xs font-medium text-[var(--text-primary)]">
							{isUploading
								? "Ingesting PDF dossier into pgvector..."
								: tDash("uploadDropzone")}
						</span>
						<span className="text-[10px] font-mono-tabular text-[var(--text-muted)] mt-1">
							PDF · Up to 5 custom scrolls ({uploadedDocs.length}/5 active)
						</span>
					</button>

					{uploadError && (
						<p className="text-xs text-[var(--accent-terracotta)] text-center font-medium">
							{uploadError}
						</p>
					)}

					{uploadedDocs.length > 0 && (
						<div className="space-y-1.5 text-xs">
							{uploadedDocs.map((doc) => (
								<div
									key={doc.name}
									className="flex items-center justify-between manuscript-card px-3 py-2"
								>
									<span className="truncate max-w-[220px] text-[var(--text-primary)] flex items-center gap-1.5">
										<CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-oasis)] shrink-0" />
										{doc.name}
									</span>
									<span className="text-[10px] font-mono-tabular text-[var(--accent-gold)]">
										{doc.chunks} chunks
									</span>
								</div>
							))}
						</div>
					)}
				</section>

				{/* Section 3: Remote URL Ingestion Request */}
				<section className="border-t border-[var(--border-subtle)] pt-5">
					<DocumentRequestForm apiKey={apiKey} />
				</section>
			</div>
		</aside>
	);
}
