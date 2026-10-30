"use client";

import {
	CheckCircle,
	ChevronDown,
	ChevronUp,
	Database,
	Search,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import { useState } from "react";

interface Step {
	id: string;
	title: string;
	status: "waiting" | "active" | "completed";
	description: string;
	icon: React.ReactNode;
}

interface ThinkingStepProps {
	isThinking: boolean;
	currentQuery: string;
}

export default function ThinkingStep({
	isThinking,
	currentQuery,
}: ThinkingStepProps): React.ReactElement | null {
	const [isOpen, setIsOpen] = useState(true);

	const steps: Step[] = [
		{
			id: "search",
			title: "Archival Index Matching",
			status: isThinking ? "active" : "completed",
			description: "Scanning UNESCO & Darah vector repositories...",
			icon: <Database className="w-3.5 h-3.5 text-[var(--accent-gold)]" />,
		},
		{
			id: "vector",
			title: "Hybrid Semantic Retrieval",
			status: isThinking ? "waiting" : "completed",
			description: "Extracting high-relevance architectural passages...",
			icon: <Search className="w-3.5 h-3.5 text-[var(--accent-terracotta)]" />,
		},
		{
			id: "guard",
			title: "Provenance & Safety Guardrails",
			status: isThinking ? "waiting" : "completed",
			description: "Verifying historical fidelity & RLS policy gates...",
			icon: <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-oasis)]" />,
		},
		{
			id: "synthesis",
			title: "Manuscript Chronicle Synthesis",
			status: isThinking ? "waiting" : "completed",
			description: "Composing bilingual narrative with folio citations...",
			icon: <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />,
		},
	];

	if (!isThinking) return null;

	return (
		<div className="manuscript-card overflow-hidden my-3 transition-all">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between p-3.5 hover:bg-[var(--bg-subtle)] transition-colors text-xs font-semibold text-[var(--text-secondary)] cursor-pointer"
			>
				<span className="flex items-center gap-2.5 text-[var(--accent-gold)] font-display">
					<span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] animate-ping" />
					Consulting the Heritage Archives...
				</span>
				{isOpen ? (
					<ChevronUp className="w-4 h-4" />
				) : (
					<ChevronDown className="w-4 h-4" />
				)}
			</button>

			{isOpen && (
				<div className="p-4 pt-2 border-t border-[var(--border-subtle)] space-y-3">
					<div className="text-[10px] text-[var(--text-muted)] font-mono-tabular tracking-wider truncate">
						INQUIRY: “{currentQuery || "..."}”
					</div>
					<div className="space-y-2.5 pt-1">
						{steps.map((step) => (
							<div key={step.id} className="flex gap-3 items-start text-xs">
								<div className="mt-0.5">
									{step.status === "completed" ? (
										<CheckCircle className="w-4 h-4 text-[var(--accent-oasis)]" />
									) : step.status === "active" ? (
										<span className="w-4 h-4 flex items-center justify-center relative">
											<span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-gold)] animate-pulse" />
										</span>
									) : (
										<span className="w-4 h-4 rounded-full border border-[var(--border-subtle)] flex items-center justify-center" />
									)}
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
										{step.icon}
										{step.title}
									</div>
									<p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
										{step.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
