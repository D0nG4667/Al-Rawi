"use client";

import { KeyRound, Send, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { type KeyboardEvent, type RefObject, useState } from "react";
import VoiceInput from "@/components/chat/VoiceInput";
import { HERITAGE_SITES, useUIStore } from "@/store/useUIStore";

interface OracleCommandBarProps {
	locale: string;
	chatInput: string;
	isThinking: boolean;
	apiKey: string;
	inputRef: RefObject<HTMLInputElement | null>;
	onChatInputChange: (value: string) => void;
	onSendChat: (directText?: string) => void;
	onApiKeyChange: (value: string) => void;
}

export default function OracleCommandBar({
	locale,
	chatInput,
	isThinking,
	apiKey,
	inputRef,
	onChatInputChange,
	onSendChat,
	onApiKeyChange,
}: OracleCommandBarProps): React.ReactElement {
	const tDash = useTranslations("Dashboard");
	const tCommon = useTranslations("Common");

	const activeSite = useUIStore((state) => state.activeSite);
	const persona = useUIStore((state) => state.persona);

	const [showKeyInput, setShowKeyInput] = useState(false);

	const siteMeta = HERITAGE_SITES[activeSite];
	const langKey = locale === "ar" ? "ar" : "en";
	const starterPrompts = siteMeta.prompts[persona][langKey];

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			onSendChat();
		}
	};

	return (
		<div className="w-full max-w-2xl mx-auto flex flex-col gap-2.5 pointer-events-auto">
			{/* Contextual Heritage Starter Prompts */}
			<div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
				{starterPrompts.map((prompt) => (
					<button
						key={prompt}
						type="button"
						disabled={isThinking}
						onClick={() => onSendChat(prompt)}
						className="shrink-0 max-w-xs sm:max-w-sm truncate text-start text-xs px-3.5 py-2 rounded-full glass-panel border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
					>
						<Sparkles className="w-3 h-3 text-[var(--accent-gold)] shrink-0" />
						<span className="truncate">{prompt}</span>
					</button>
				))}
			</div>

			{/* Optional Collapsible BYOK Key Drawer */}
			{showKeyInput && (
				<div className="glass-panel px-4 py-2.5 flex items-center gap-3 animate-in fade-in duration-150">
					<KeyRound className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
					<input
						type="password"
						value={apiKey}
						onChange={(e) => onApiKeyChange(e.target.value)}
						placeholder="Gemini API Key (optional override — server fallback active)"
						aria-label="Gemini API Key"
						className="bg-transparent text-xs outline-none flex-1 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-mono-tabular"
					/>
				</div>
			)}

			{/* Main Command Dock */}
			<div className="glass-panel p-2 flex items-center gap-2 border border-[var(--border-strong)]">
				<button
					type="button"
					onClick={() => setShowKeyInput((prev) => !prev)}
					title={tCommon("apiKeyLabel")}
					aria-label={tCommon("apiKeyLabel")}
					className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
						apiKey.trim() || showKeyInput
							? "heritage-chip"
							: "border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-secondary)]"
					}`}
				>
					<KeyRound className="w-4 h-4" />
				</button>

				<div className="relative flex-1 flex items-center">
					<input
						ref={inputRef}
						type="text"
						dir="auto"
						value={chatInput}
						onChange={(e) => onChatInputChange(e.target.value)}
						onKeyDown={handleKeyDown}
						disabled={isThinking}
						placeholder={tDash("chatPlaceholder")}
						className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] focus:border-[var(--border-strong)] rounded-xl ps-4 pe-11 py-2.5 w-full text-sm outline-none transition-colors disabled:opacity-50 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
					/>
					<button
						type="button"
						onClick={() => onSendChat()}
						disabled={isThinking || !chatInput.trim()}
						aria-label="Submit inquiry to Al-Rawi Oracle"
						className="absolute inset-inline-end-2 p-1.5 rounded-lg heritage-chip disabled:opacity-30 cursor-pointer"
					>
						<Send className="w-4 h-4" />
					</button>
				</div>

				<VoiceInput
					onTranscript={(text) => onSendChat(text)}
					disabled={isThinking}
				/>
			</div>

			{/* Subtle Keyboard Navigation Telemetry Footer */}
			<div className="text-center hidden sm:block">
				<span className="text-[10px] font-mono-tabular uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-surface)] px-3 py-1 rounded-full border border-[var(--border-subtle)]">
					{tDash("keyboardHint")}
				</span>
			</div>
		</div>
	);
}
