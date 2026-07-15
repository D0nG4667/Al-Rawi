"use client";

import { useState } from "react";
import {
	ChevronDown,
	ChevronUp,
	CheckCircle,
	Search,
	ShieldCheck,
	Sparkles,
	Database,
} from "lucide-react";

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
}: ThinkingStepProps) {
	const [isOpen, setIsOpen] = useState(true);

	// Static reasoning checkpoints simulation for seamless client UX
	const steps: Step[] = [
		{
			id: "search",
			title: "Workspace Index Matching",
			status: isThinking ? "active" : "completed",
			description: "Searching database and semantic cache repositories...",
			icon: <Database className="w-4 h-4 text-blue-400" />,
		},
		{
			id: "vector",
			title: "Hybrid Vector Retrieval",
			status: isThinking ? "waiting" : "completed",
			description:
				"Matching document nodes and extracting heritage segments...",
			icon: <Search className="w-4 h-4 text-purple-400" />,
		},
		{
			id: "guard",
			title: "Prompt Guardrails Verification",
			status: isThinking ? "waiting" : "completed",
			description:
				"Validating against prompt injection & safety policy maps...",
			icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
		},
		{
			id: "synthesis",
			title: "Gemini Context Synthesis",
			status: isThinking ? "waiting" : "completed",
			description:
				"Formatting historical narratives and multilingual structures...",
			icon: <Sparkles className="w-4 h-4 text-amber-400" />,
		},
	];

	if (!isThinking) return null;

	return (
		<div className="border border-white/10 bg-black/40 rounded-xl overflow-hidden mb-4 transition-all">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition-colors text-xs font-semibold text-white/70"
			>
				<span className="flex items-center gap-2 text-amber-300">
					<span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
					Reasoning Engine Pipeline
				</span>
				{isOpen ? (
					<ChevronUp className="w-4 h-4" />
				) : (
					<ChevronDown className="w-4 h-4" />
				)}
			</button>

			{isOpen && (
				<div className="p-4 pt-0 border-t border-white/5 bg-black/20 divide-y divide-white/5 space-y-3.5">
					<div className="text-[10px] text-white/40 mt-3 font-mono tracking-wider">
						QUERY: "{currentQuery || "..."}"
					</div>
					<div className="space-y-3 pt-3.5">
						{steps.map((step) => (
							<div key={step.id} className="flex gap-3 items-start text-xs">
								<div className="mt-0.5">
									{step.status === "completed" ? (
										<CheckCircle className="w-4 h-4 text-green-400" />
									) : step.status === "active" ? (
										<span className="w-4 h-4 flex items-center justify-center relative">
											<span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
										</span>
									) : (
										<span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center" />
									)}
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-1.5 font-medium text-white/90">
										{step.icon}
										{step.title}
									</div>
									<p className="text-[10px] text-white/50 mt-0.5 leading-relaxed">
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
