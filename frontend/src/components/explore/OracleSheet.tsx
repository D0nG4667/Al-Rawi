"use client";

import { Compass, ScrollText, Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type React from "react";
import ThinkingStep from "@/components/chat/ThinkingStep";
import ManuscriptMessage from "@/components/explore/ManuscriptMessage";
import type { ChatMessage, ChatSource } from "@/components/explore/types";
import HeritageOrnament from "@/components/ui/HeritageOrnament";
import PersonaSelector from "@/components/ui/PersonaSelector";
import { HERITAGE_SITES, useUIStore } from "@/store/useUIStore";

interface OracleSheetProps {
	locale: string;
	isOpen: boolean;
	chatHistory: ChatMessage[];
	isThinking: boolean;
	activeQuery: string;
	onClose: () => void;
	onSelectSource: (source: ChatSource, index: number) => void;
	onOpenMap: () => void;
	onSendPrompt: (prompt: string) => void;
}

export default function OracleSheet({
	locale,
	isOpen,
	chatHistory,
	isThinking,
	activeQuery,
	onClose,
	onSelectSource,
	onOpenMap,
	onSendPrompt,
}: OracleSheetProps): React.ReactElement | null {
	const tDash = useTranslations("Dashboard");
	const tCommon = useTranslations("Common");

	const activeSite = useUIStore((state) => state.activeSite);
	const persona = useUIStore((state) => state.persona);

	if (!isOpen) return null;

	const siteMeta = HERITAGE_SITES[activeSite];
	const siteTitle = locale === "ar" ? siteMeta.titleAr : siteMeta.titleEn;
	const starterPrompts =
		siteMeta.prompts[persona][locale === "ar" ? "ar" : "en"];

	return (
		<aside
			aria-label={tDash("oracleTrigger")}
			className="fixed inset-x-3 bottom-3 top-24 md:inset-y-24 md:inset-inline-end-6 md:inset-inline-start-auto md:w-[460px] z-30 glass-panel border border-[var(--border-strong)] flex flex-col pointer-events-auto overflow-hidden animate-in fade-in duration-200"
		>
			<HeritageOrnament variant="najdi-band" />

			{/* Header */}
			<header className="px-5 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex items-center justify-between gap-2">
				<div className="flex items-center gap-2.5">
					<div className="p-2 rounded-xl heritage-chip">
						<ScrollText className="w-4 h-4" />
					</div>
					<div>
						<h2 className="font-display font-bold text-base tracking-wide">
							{tDash("oracleTrigger")}
						</h2>
						<p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[var(--accent-gold)]">
							{siteTitle} · {siteMeta.unescoRef}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-1.5">
					<button
						type="button"
						onClick={onOpenMap}
						title={tDash("viewMap")}
						className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--bg-surface)] flex items-center gap-1 cursor-pointer"
					>
						<Compass className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
						<span>{tDash("viewMap")}</span>
					</button>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close Oracle Chronicle"
						className="p-1.5 rounded-full border border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] transition-all cursor-pointer"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
			</header>

			{/* Persona Selector Bar */}
			<div className="px-5 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
				<PersonaSelector />
			</div>

			{/* Scrollable Illuminated Chronicle Area */}
			<div className="flex-1 overflow-y-auto p-5 space-y-5">
				{chatHistory.length === 0 && !isThinking ? (
					<div className="h-full flex flex-col items-center justify-center text-center py-8 px-3 space-y-4">
						<div className="p-4 rounded-full manuscript-card border border-[var(--border-strong)]">
							<HeritageOrnament variant="astrolabe" className="w-10 h-10" />
						</div>
						<div className="space-y-1.5 max-w-sm">
							<h3 className="font-display font-bold text-base text-[var(--text-primary)]">
								{tDash("emptyChronicleTitle")}
							</h3>
							<p className="text-xs text-[var(--text-secondary)] leading-relaxed">
								{tDash("emptyChronicleBody")}
							</p>
							<p className="text-[11px] text-[var(--text-muted)] pt-1">
								{tCommon("tagline")}
							</p>
						</div>

						<div className="w-full space-y-2 pt-2">
							{starterPrompts.map((prompt) => (
								<button
									key={prompt}
									type="button"
									onClick={() => onSendPrompt(prompt)}
									className="w-full text-start manuscript-card p-3 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-start gap-2 cursor-pointer"
								>
									<Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0 mt-0.5" />
									<span>{prompt}</span>
								</button>
							))}
						</div>
					</div>
				) : (
					chatHistory.map((msg) => (
						<ManuscriptMessage
							key={msg.id}
							message={msg}
							onSelectSource={onSelectSource}
						/>
					))
				)}

				<ThinkingStep isThinking={isThinking} currentQuery={activeQuery} />
			</div>
		</aside>
	);
}
