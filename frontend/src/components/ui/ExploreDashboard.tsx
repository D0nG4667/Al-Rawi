"use client";

import { useTranslations } from "next-intl";
import { type KeyboardEvent, useState } from "react";
import DocumentRequestForm from "./DocumentRequestForm";
import PersonaSelector from "./PersonaSelector";
import MindMap from "./MindMap";
import { MessageSquare, Send } from "lucide-react";

interface ExploreDashboardProps {
	locale: string;
}

export default function ExploreDashboard({ locale }: ExploreDashboardProps) {
	const t = useTranslations();
	const [isMapOpen, setIsMapOpen] = useState(false);
	const [chatInput, setChatInput] = useState("");
	const [chatHistory, setChatHistory] = useState<
		Array<{ id: string; role: "user" | "oracle"; text: string }>
	>([]);
	const [isThinking, setIsThinking] = useState(false);

	const switchLocale = locale === "en" ? "ar" : "en";
	const switchLabel = locale === "en" ? "العربية" : "English";

	const handleSendChat = async () => {
		const query = chatInput.trim();
		if (!query) return;

		setChatInput("");
		setChatHistory((prev) => [
			...prev,
			{ id: `user-${Date.now()}`, role: "user", text: query },
		]);
		setIsThinking(true);

		try {
			const res = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ query }),
			});

			if (!res.ok) {
				throw new Error("Oracle is unresponsive.");
			}

			const data = await res.json();
			setChatHistory((prev) => [
				...prev,
				{
					id: `oracle-${Date.now()}`,
					role: "oracle",
					text: data.answer || "I could not resolve that.",
				},
			]);
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Connection failed.";
			setChatHistory((prev) => [
				...prev,
				{
					id: `error-${Date.now()}`,
					role: "oracle",
					text: `Error: ${errorMessage}`,
				},
			]);
		} finally {
			setIsThinking(false);
		}
	};

	const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSendChat();
		}
	};

	return (
		<div className="relative z-10 container mx-auto p-6 flex flex-col h-screen pointer-events-none text-white">
			{/* Header */}
			<header className="glass-panel p-5 mb-6 flex justify-between items-center pointer-events-auto">
				<div>
					<h1 className="text-xl font-bold tracking-wider">
						{t("Common.title")}
					</h1>
					<p className="text-xs opacity-60 mt-0.5">{t("Common.subtitle")}</p>
				</div>
				<div className="flex items-center gap-4">
					<a
						href={`/${switchLocale}`}
						className="text-xs border border-white/20 rounded-full px-3.5 py-1.5 hover:bg-white/10 transition-all font-medium"
					>
						{switchLabel}
					</a>
					<div className="flex items-center gap-2">
						<span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
						<span className="text-xs opacity-80 tracking-wide font-medium">
							Gemini Connected
						</span>
					</div>
				</div>
			</header>

			{/* Panels Grid */}
			<div className="flex-1 flex gap-6 min-h-0">
				{/* Left panel: Archive Ingestion */}
				<aside className="w-80 glass-panel p-5 pointer-events-auto flex flex-col">
					<h2 className="font-semibold mb-4 text-lg border-b border-white/10 pb-2">
						{t("Dashboard.uploadTitle")}
					</h2>
					<div className="flex-1 flex flex-col gap-6 justify-center">
						<div className="border border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center text-center opacity-70">
							<svg
								className="w-8 h-8 mb-3 opacity-60"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
							<span className="text-sm">{t("Dashboard.uploadDropzone")}</span>
						</div>

						<div className="border-t border-white/10 pt-4">
							<DocumentRequestForm />
						</div>
					</div>
				</aside>

				{/* Middle panel: Map Trigger */}
				<div className="flex-1 flex items-end justify-center pb-12 pointer-events-auto">
					<button
						type="button"
						onClick={() => setIsMapOpen(true)}
						className="bg-white/10 text-white px-8 py-3.5 rounded-full backdrop-blur-md border border-white/25 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] cursor-pointer"
					>
						{t("Dashboard.viewMap")}
					</button>
				</div>

				{/* Right panel: Agentic Chat */}
				<aside className="w-96 glass-panel p-5 pointer-events-auto flex flex-col gap-4">
					<h2 className="font-semibold text-lg border-b border-white/10 pb-2 flex items-center gap-2">
						<MessageSquare className="w-4 h-4" />
						Oracle Guide
					</h2>

					{/* Conversational Scroll Area */}
					<div className="flex-1 bg-black/30 rounded-xl p-4 overflow-y-auto text-sm space-y-4">
						{chatHistory.length === 0 ? (
							<div className="opacity-80 leading-relaxed">
								{t("Common.tagline")}
							</div>
						) : (
							chatHistory.map((msg) => (
								<div
									key={msg.id}
									className={`flex flex-col ${
										msg.role === "user" ? "items-end" : "items-start"
									}`}
								>
									<span className="text-[10px] opacity-40 uppercase tracking-wider mb-0.5">
										{msg.role === "user" ? "You" : "Al-Rawi"}
									</span>
									<span
										className={`inline-block px-3.5 py-2 rounded-2xl max-w-[85%] leading-relaxed ${
											msg.role === "user"
												? "bg-white/10 border border-white/10"
												: "bg-black/40 border border-white/5"
										}`}
									>
										{msg.text}
									</span>
								</div>
							))
						)}

						{isThinking && (
							<div className="flex items-center gap-2 text-xs opacity-60">
								<span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
								<span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.2s]" />
								<span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
								<span>Oracle is contemplating...</span>
							</div>
						)}
					</div>

					<div className="border-t border-white/10 pt-3">
						<PersonaSelector />
					</div>

					{/* Chat Input Container */}
					<div className="relative flex items-center">
						<input
							type="text"
							value={chatInput}
							onChange={(e) => setChatInput(e.target.value)}
							onKeyDown={handleKeyPress}
							disabled={isThinking}
							placeholder={t("Dashboard.chatPlaceholder")}
							className="bg-black/50 border border-white/15 rounded-lg pl-4 pr-12 py-2.5 w-full text-sm outline-none focus:border-white/30 transition-colors disabled:opacity-50"
						/>
						<button
							type="button"
							onClick={handleSendChat}
							disabled={isThinking || !chatInput.trim()}
							className="absolute right-2.5 p-1.5 rounded-md hover:bg-white/10 transition-colors disabled:opacity-30 cursor-pointer"
						>
							<Send className="w-4 h-4 text-white" />
						</button>
					</div>
				</aside>
			</div>

			{/* Interactive Mind Map Canvas Overlay */}
			{isMapOpen && (
				<MindMap
					query={chatHistory[chatHistory.length - 1]?.text}
					onClose={() => setIsMapOpen(false)}
				/>
			)}
		</div>
	);
}
