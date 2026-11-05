"use client";

import { Feather, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import type { ChatMessage, ChatSource } from "@/components/explore/types";
import HeritageOrnament from "@/components/ui/HeritageOrnament";

interface ManuscriptMessageProps {
	message: ChatMessage;
	onSelectSource: (source: ChatSource, index: number) => void;
}

/**
 * Renders an Oracle response with a progressive manuscript reveal (respecting
 * prefers-reduced-motion), structured paragraph/list blocks, and interactive
 * archival folio citation chips.
 */
export default function ManuscriptMessage({
	message,
	onSelectSource,
}: ManuscriptMessageProps): React.ReactElement {
	const [visibleLength, setVisibleLength] = useState<number>(
		message.isNew ? 0 : message.text.length,
	);

	useEffect(() => {
		if (!message.isNew) {
			setVisibleLength(message.text.length);
			return;
		}

		const prefersReduced =
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (prefersReduced) {
			setVisibleLength(message.text.length);
			return;
		}

		const total = message.text.length;
		const step = Math.max(6, Math.ceil(total / 42));
		const interval = window.setInterval(() => {
			setVisibleLength((prev) => {
				if (prev + step >= total) {
					window.clearInterval(interval);
					return total;
				}
				return prev + step;
			});
		}, 24);

		return () => window.clearInterval(interval);
	}, [message.isNew, message.text]);

	if (message.role === "user") {
		return (
			<div className="flex flex-col items-end">
				<span className="text-[10px] font-mono-tabular text-[var(--text-muted)] uppercase tracking-widest mb-1">
					Inquirer
				</span>
				<div
					dir="auto"
					className="inline-block px-4 py-2.5 rounded-2xl max-w-[88%] leading-relaxed heritage-chip font-medium text-sm"
				>
					{message.text}
				</div>
			</div>
		);
	}

	const displayedText = message.text.slice(0, visibleLength);
	const isRevealing = visibleLength < message.text.length;
	const paragraphBlocks: Array<{ id: string; text: string }> = [];
	const seenCounts = new Map<string, number>();
	for (const raw of displayedText.split(/\n{2,}/)) {
		const trimmed = raw.trim();
		if (!trimmed) continue;
		const baseKey = trimmed.slice(0, 24);
		const count = (seenCounts.get(baseKey) ?? 0) + 1;
		seenCounts.set(baseKey, count);
		paragraphBlocks.push({
			id: `${message.id}-${baseKey}-${count}`,
			text: trimmed,
		});
	}

	return (
		<article className="flex flex-col items-start w-full">
			<div className="flex items-center gap-1.5 mb-1.5">
				<HeritageOrnament variant="corner-rosette" className="w-3.5 h-3.5" />
				<span className="text-[10px] font-mono-tabular text-[var(--accent-gold)] uppercase tracking-widest font-semibold">
					Al-Rawi Manuscript Chronicle
				</span>
				{isRevealing && (
					<Feather className="w-3 h-3 text-[var(--accent-gold)] animate-bounce" />
				)}
			</div>

			<div
				dir="auto"
				className="w-full manuscript-card p-4 space-y-3 leading-relaxed text-sm border-s-2 border-s-[var(--accent-gold)]"
			>
				{paragraphBlocks.map((block) => {
					const para = block.text;
					const cleanHeading = para.startsWith("### ")
						? para.slice(4)
						: para.startsWith("## ")
							? para.slice(3)
							: null;

					if (cleanHeading) {
						return (
							<h4
								key={block.id}
								className="font-display font-bold text-base text-[var(--accent-gold)] pt-1"
							>
								{cleanHeading}
							</h4>
						);
					}

					return (
						<p
							key={block.id}
							className="text-[var(--text-primary)] whitespace-pre-wrap"
						>
							{para.replace(/\*\*(.*?)\*\*/g, "$1")}
						</p>
					);
				})}

				{message.sources && message.sources.length > 0 && (
					<div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
						<span className="text-[10px] font-mono-tabular uppercase tracking-widest text-[var(--text-muted)]">
							Verified Archival Citations
						</span>
						<div className="flex gap-1.5 flex-wrap">
							{message.sources.map((src, idx) => (
								<button
									key={src.id}
									type="button"
									data-tour={idx === 0 ? "citation-chip" : undefined}
									onClick={() => onSelectSource(src, idx)}
									className="text-[10px] font-mono-tabular heritage-chip rounded-lg px-2.5 py-1 flex items-center gap-1.5 cursor-pointer font-semibold"
								>
									<FileText className="w-3 h-3" />
									<span>Folio [{idx + 1}]</span>
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</article>
	);
}
