"use client";

import {
	AudioLines,
	Pause,
	Play,
	Plus,
	Square,
	Trash2,
	Volume2,
	X,
} from "lucide-react";
import type React from "react";
import type { DialogueLine, PodcastScript } from "@/components/explore/types";
import HeritageOrnament from "@/components/ui/HeritageOrnament";

interface MajlisStudioModalProps {
	isOpen: boolean;
	isDrafting: boolean;
	isStreaming: boolean;
	isPlaying: boolean;
	script: PodcastScript | null;
	hasAudioAnalyser: boolean;
	notice?: string;
	onClose: () => void;
	onTitleChange: (title: string) => void;
	onLineChange: (
		index: number,
		field: keyof DialogueLine,
		value: string,
	) => void;
	onAddLine: () => void;
	onDeleteLine: (index: number) => void;
	onGenerateAudio: () => void;
	onTogglePlayPause: () => void;
	onStopAudio: () => void;
}

export default function MajlisStudioModal({
	isOpen,
	isDrafting,
	isStreaming,
	isPlaying,
	script,
	hasAudioAnalyser,
	notice,
	onClose,
	onTitleChange,
	onLineChange,
	onAddLine,
	onDeleteLine,
	onGenerateAudio,
	onTogglePlayPause,
	onStopAudio,
}: MajlisStudioModalProps): React.ReactElement | null {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 bg-[var(--bg-canvas)]/90 backdrop-blur-xl flex flex-col pointer-events-auto text-[var(--text-primary)]">
			<HeritageOrnament variant="najdi-band" />

			<header className="flex justify-between items-center px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
				<div>
					<h2 className="text-lg font-display font-bold tracking-wide flex items-center gap-2 text-[var(--accent-gold)]">
						<Volume2 className="w-5 h-5 animate-pulse" />
						The Majlis Podcast Studio
					</h2>
					<p className="text-xs text-[var(--text-secondary)] mt-0.5">
						Draft, refine, and synthesize multi-speaker oral histories
					</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="p-2.5 rounded-full border border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)] active:scale-95 transition-all cursor-pointer"
					aria-label="Close Majlis"
				>
					<X className="w-4 h-4" />
				</button>
			</header>

			<div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full flex flex-col gap-6">
				{isDrafting && (
					<div className="flex-1 flex flex-col items-center justify-center gap-3">
						<span className="w-9 h-9 rounded-full border-2 border-[var(--border-subtle)] border-t-[var(--accent-gold)] animate-spin" />
						<span className="text-xs tracking-widest text-[var(--accent-gold)] uppercase font-mono-tabular">
							Composing Majlis Dialogue Script...
						</span>
					</div>
				)}

				{!isDrafting && script && (
					<>
						<div className="flex flex-col gap-2">
							<label
								htmlFor="majlis-title"
								className="text-xs font-mono-tabular uppercase tracking-widest text-[var(--text-secondary)]"
							>
								Episode Chronicle Title
							</label>
							<input
								id="majlis-title"
								type="text"
								value={script.title}
								onChange={(e) => onTitleChange(e.target.value)}
								className="manuscript-card px-4 py-3 w-full text-base outline-none focus:border-[var(--border-strong)] transition-all font-display font-semibold"
							/>
						</div>

						<div className="flex flex-col gap-3">
							<h3 className="text-xs font-mono-tabular uppercase tracking-widest text-[var(--text-secondary)]">
								Dialogue Script (Editable)
							</h3>
							<div className="space-y-3">
								{script.dialogue.map((line, index) => (
									<div
										key={line.id}
										className="flex gap-4 items-start manuscript-card p-4"
									>
										<div className="flex flex-col gap-2">
											<select
												value={line.speaker}
												onChange={(e) =>
													onLineChange(index, "speaker", e.target.value)
												}
												className="bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[var(--border-strong)] cursor-pointer font-semibold text-[var(--accent-gold)]"
											>
												<option value="Visitor">Visitor</option>
												<option value="Rawi">Rawi (Oracle)</option>
											</select>
										</div>
										<textarea
											value={line.text}
											rows={2}
											dir="auto"
											onChange={(e) =>
												onLineChange(index, "text", e.target.value)
											}
											className="flex-1 bg-transparent border-0 outline-none text-sm resize-none text-[var(--text-primary)] leading-relaxed"
										/>
										<button
											type="button"
											onClick={() => onDeleteLine(index)}
											className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-terracotta)] active:scale-95 transition-all text-[var(--accent-terracotta)] cursor-pointer"
											aria-label="Delete Line"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								))}
							</div>
						</div>

						<div className="flex flex-wrap justify-between items-center gap-4 mt-2 border-t border-[var(--border-subtle)] pt-6 pb-12">
							<button
								type="button"
								onClick={onAddLine}
								className="manuscript-card px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 cursor-pointer"
							>
								<Plus className="w-4 h-4 text-[var(--accent-gold)]" />
								Add Dialogue Line
							</button>

							<div className="flex items-center gap-4">
								{hasAudioAnalyser && (
									<div className="flex items-center gap-3 manuscript-card rounded-full px-4 py-2 text-xs">
										<AudioLines className="w-4 h-4 text-[var(--accent-gold)] animate-pulse" />
										<span className="font-medium">Streaming Voice Audio</span>
										<button
											type="button"
											onClick={onTogglePlayPause}
											className="p-1 rounded-full hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
										>
											{isPlaying ? (
												<Pause className="w-3.5 h-3.5" />
											) : (
												<Play className="w-3.5 h-3.5" />
											)}
										</button>
										<button
											type="button"
											onClick={onStopAudio}
											className="p-1 rounded-full hover:bg-[var(--bg-subtle)] transition-colors text-[var(--accent-terracotta)] cursor-pointer"
										>
											<Square className="w-3.5 h-3.5" />
										</button>
									</div>
								)}

								{notice && (
									<output className="block text-[11px] text-[var(--accent-terracotta)] mb-2">
										{notice}
									</output>
								)}

								<button
									type="button"
									onClick={onGenerateAudio}
									disabled={isStreaming || script.dialogue.length === 0}
									className="heritage-chip px-6 py-2.5 rounded-full disabled:opacity-50 active:scale-95 transition-all text-xs font-bold flex items-center gap-2 cursor-pointer"
								>
									{isStreaming ? (
										<>
											<span className="w-3.5 h-3.5 rounded-full border-2 border-[var(--border-subtle)] border-t-[var(--accent-gold)] animate-spin" />
											Synthesizing...
										</>
									) : (
										<>
											<Volume2 className="w-4 h-4" />
											Listen to the Majlis
										</>
									)}
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
