"use client";

import {
	AudioLines,
	CheckCircle2,
	FileText,
	KeyRound,
	MessageSquare,
	Pause,
	Play,
	Plus,
	Send,
	Sparkles,
	Square,
	Trash2,
	Volume2,
	X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
	type ChangeEvent,
	type DragEvent,
	type KeyboardEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import Scene from "@/components/canvas/Scene";
import CitationDrawer from "@/components/chat/CitationDrawer";
import ThinkingStep from "@/components/chat/ThinkingStep";
import VoiceInput from "@/components/chat/VoiceInput";
import { useGeofence } from "@/hooks/useGeofence";
import { useSoundDesign } from "@/hooks/useSoundDesign";
import { useUIStore } from "@/store/useUIStore";
import DocumentRequestForm from "./DocumentRequestForm";
import MindMap from "./MindMap";
import PersonaSelector from "./PersonaSelector";

interface ExploreDashboardProps {
	locale: string;
}

interface DialogueLine {
	id: string;
	speaker: string;
	text: string;
}

interface PodcastScript {
	title: string;
	dialogue: DialogueLine[];
}

interface UploadedDoc {
	name: string;
	chunks: number;
}

export default function ExploreDashboard({ locale }: ExploreDashboardProps) {
	const t = useTranslations();

	// Activate geolocation-based UNESCO geofencing
	useGeofence();

	// Global UI Store
	const persona = useUIStore((state) => state.persona);
	const setAIThinking = useUIStore((state) => state.setAIThinking);

	// Component & Modal visibility states
	const [isMapOpen, setIsMapOpen] = useState(false);
	const [isMajlisOpen, setIsMajlisOpen] = useState(false);

	// Optional Client API Key & File Upload states
	const [apiKey, setApiKey] = useState("");
	const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState("");
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	// Chat states
	const [chatInput, setChatInput] = useState("");
	const [chatHistory, setChatHistory] = useState<
		Array<{
			id: string;
			role: "user" | "oracle";
			text: string;
			sources?: Array<{
				id: string;
				metadata?: Record<string, unknown>;
				snippet?: string;
			}>;
		}>
	>([]);
	const [isThinking, setIsThinking] = useState(false);
	const [activeQuery, setActiveQuery] = useState("");

	// Citation States
	const [activeCitation, setActiveCitation] = useState<{
		title: string;
		content: string;
		page?: string | number;
	} | null>(null);
	const [isCitationOpen, setIsCitationOpen] = useState(false);

	// UI Sound Design
	const { playClick, playWhoosh, playChime } = useSoundDesign();

	// Majlis/Audio states
	const [isMajlisDrafting, setIsMajlisDrafting] = useState(false);
	const [isMajlisStreaming, setIsMajlisStreaming] = useState(false);
	const [majlisScript, setMajlisScript] = useState<PodcastScript | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [audioAnalyser, setAudioAnalyser] = useState<AnalyserNode | null>(null);

	// Audio element & context references
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const audioCtxRef = useRef<AudioContext | null>(null);

	// Preloader State
	const [isPreloading, setIsPreloading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsPreloading(false);
		}, 1800);
		return () => clearTimeout(timer);
	}, []);

	const switchLocale = locale === "en" ? "ar" : "en";
	const switchLabel = locale === "en" ? "العربية" : "English";

	const handleFileUpload = async (file: File): Promise<void> => {
		if (!file.name.toLowerCase().endsWith(".pdf")) {
			setUploadError("Only PDF dossiers are supported.");
			return;
		}
		if (uploadedDocs.length >= 5) {
			setUploadError("Maximum of 5 PDF dossiers reached.");
			return;
		}

		playClick();
		setIsUploading(true);
		setUploadError("");

		try {
			const formData = new FormData();
			formData.append("file", file);
			if (apiKey.trim()) {
				formData.append("api_key", apiKey.trim());
			}

			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(
					typeof errData.detail === "string"
						? errData.detail
						: "Failed to ingest PDF dossier.",
				);
			}

			const data = await res.json();
			setUploadedDocs((prev) => [
				...prev,
				{
					name: data.filename || file.name,
					chunks: typeof data.chunks === "number" ? data.chunks : 0,
				},
			]);
			playChime();
		} catch (err: unknown) {
			setUploadError(
				err instanceof Error ? err.message : "Failed to upload document.",
			);
		} finally {
			setIsUploading(false);
		}
	};

	const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const selected = e.target.files?.[0];
		if (selected) {
			handleFileUpload(selected);
		}
		e.target.value = "";
	};

	const handleDrop = (e: DragEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		const dropped = e.dataTransfer.files?.[0];
		if (dropped) {
			handleFileUpload(dropped);
		}
	};

	const handleSendChat = async (directText?: string): Promise<void> => {
		const query = (
			typeof directText === "string" ? directText : chatInput
		).trim();
		if (!query) return;

		playClick();
		setChatInput("");
		setActiveQuery(query);
		setChatHistory((prev) => [
			...prev,
			{ id: `user-${Date.now()}`, role: "user", text: query },
		]);
		setIsThinking(true);
		setAIThinking(true);

		try {
			const payload: {
				query: string;
				persona: string;
				api_key?: string;
			} = {
				query,
				persona,
			};
			if (apiKey.trim()) {
				payload.api_key = apiKey.trim();
			}

			const res = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				throw new Error("Oracle is unresponsive.");
			}

			const data = await res.json();
			const mappedSources = (data.sources || []).map(
				(
					src: { metadata?: Record<string, unknown>; snippet?: string },
					i: number,
				) => ({
					...src,
					id: `src-${i}-${Date.now()}`,
				}),
			);
			setChatHistory((prev) => [
				...prev,
				{
					id: `oracle-${Date.now()}`,
					role: "oracle",
					text: data.answer || "I could not resolve that.",
					sources: mappedSources,
				},
			]);
			playChime();
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
			setAIThinking(false);
		}
	};

	const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
		if (e.key === "Enter") {
			handleSendChat();
		}
	};

	// --- Majlis Storytelling Handlers ---

	const handleSummonMajlis = async (): Promise<void> => {
		playClick();
		setIsMajlisOpen(true);
		playWhoosh();
		setIsMajlisDrafting(true);
		setMajlisScript(null);
		stopAudio();

		// Use the last user search query or fallback to a general overview query
		const lastUserMsg = [...chatHistory]
			.reverse()
			.find((msg) => msg.role === "user");
		const query = lastUserMsg?.text || "General Saudi UNESCO world heritage";

		try {
			const payload: { query: string; api_key?: string } = { query };
			if (apiKey.trim()) {
				payload.api_key = apiKey.trim();
			}

			const res = await fetch("/api/podcast/draft", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				throw new Error("Failed to draft Majlis dialogue.");
			}
			const data = await res.json();
			const mappedDialogue = (data.dialogue || []).map(
				(line: Omit<DialogueLine, "id"> & { id?: string }, i: number) => ({
					...line,
					id: line.id || `line-${i}-${Date.now()}`,
				}),
			);
			setMajlisScript({
				title: data.title || "UNESCO Heritage of Arabia",
				dialogue: mappedDialogue,
			});
		} catch (error) {
			console.error("[-] Majlis draft failed:", error);
			// Fallback placeholder script
			setMajlisScript({
				title: "UNESCO Heritage of Arabia",
				dialogue: [
					{
						id: `line-fallback-1-${Date.now()}`,
						speaker: "Visitor",
						text: "Hello! Can you tell me about the historical significance of Diriyah?",
					},
					{
						id: `line-fallback-2-${Date.now()}`,
						speaker: "Rawi",
						text: "أهلاً بك. Diriyah was the birthplace of the first Saudi State, standing as a symbol of Saudi history.",
					},
				],
			});
		} finally {
			setIsMajlisDrafting(false);
		}
	};

	const handleScriptChange = (
		index: number,
		field: keyof DialogueLine,
		value: string,
	): void => {
		if (!majlisScript) return;
		const updatedDialogue = [...majlisScript.dialogue];
		updatedDialogue[index] = {
			...updatedDialogue[index],
			[field]: value,
		};
		setMajlisScript({
			...majlisScript,
			dialogue: updatedDialogue,
		});
	};

	const handleAddDialogueLine = (): void => {
		if (!majlisScript) return;
		setMajlisScript({
			...majlisScript,
			dialogue: [
				...majlisScript.dialogue,
				{
					id: `line-added-${Date.now()}`,
					speaker: "Visitor",
					text: "New question here...",
				},
			],
		});
	};

	const handleDeleteDialogueLine = (index: number): void => {
		if (!majlisScript) return;
		const updatedDialogue = majlisScript.dialogue.filter((_, i) => i !== index);
		setMajlisScript({
			...majlisScript,
			dialogue: updatedDialogue,
		});
	};

	const handleGenerateAudio = async (): Promise<void> => {
		if (!majlisScript) return;
		setIsMajlisStreaming(true);
		stopAudio();

		try {
			const res = await fetch("/api/audio/stream", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ dialogue: majlisScript.dialogue }),
			});

			if (!res.ok) {
				throw new Error("Vocal synthesis failed.");
			}

			const audioBlob = await res.blob();
			const audioUrl = URL.createObjectURL(audioBlob);

			// Initialize Audio Elements & Context
			const audio = new Audio(audioUrl);
			audio.crossOrigin = "anonymous";
			audioRef.current = audio;

			const AudioCtxClass =
				window.AudioContext ||
				(window as unknown as { webkitAudioContext: typeof AudioContext })
					.webkitAudioContext;
			const audioCtx = new AudioCtxClass();
			audioCtxRef.current = audioCtx;

			const source = audioCtx.createMediaElementSource(audio);
			const analyser = audioCtx.createAnalyser();
			analyser.fftSize = 256;
			source.connect(analyser);
			analyser.connect(audioCtx.destination);

			setAudioAnalyser(analyser);

			audio.addEventListener("ended", () => {
				setIsPlaying(false);
				setAudioAnalyser(null);
			});

			audio.play();
			setIsPlaying(true);
		} catch (error) {
			console.error("[-] Vocalization error:", error);
			alert("Failed to synthesize vocals. Please check your ElevenLabs quota.");
		} finally {
			setIsMajlisStreaming(false);
		}
	};

	const togglePlayPause = (): void => {
		if (!audioRef.current) return;
		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(false);
		} else {
			audioRef.current.play();
			setIsPlaying(true);
		}
	};

	const stopAudio = (): void => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current = null;
		}
		if (audioCtxRef.current) {
			audioCtxRef.current.close();
			audioCtxRef.current = null;
		}
		setAudioAnalyser(null);
		setIsPlaying(false);
	};

	const handleCloseMajlis = (): void => {
		playClick();
		stopAudio();
		setIsMajlisOpen(false);
		playWhoosh();
		setMajlisScript(null);
	};

	return (
		<>
			{/* Cinematic Entry Preloader */}
			{isPreloading && (
				<div className="fixed inset-0 z-50 bg-[#0B0C10] flex flex-col items-center justify-center text-white select-none pointer-events-auto">
					<div className="flex flex-col items-center gap-6 animate-pulse">
						<div className="w-16 h-16 rounded-full border-2 border-amber-500/25 border-t-amber-400 animate-spin flex items-center justify-center shadow-[0_0_24px_rgba(245,158,11,0.2)]">
							<Sparkles className="w-6 h-6 text-amber-300" />
						</div>
						<div className="text-center space-y-2">
							<h1 className="text-2xl font-bold tracking-[0.2em] uppercase text-amber-300">
								الراوي • AL-RAWI
							</h1>
							<p className="text-xs opacity-50 tracking-wider">
								Saudi Heritage & Tourism AI Oracle
							</p>
						</div>
					</div>
					<div className="absolute bottom-10 text-[10px] opacity-40 uppercase tracking-[0.15em] font-mono">
						Initializing 3D Workspace Engine
					</div>
				</div>
			)}

			{/* fixed backgrounds & Canvas */}
			<Scene audioAnalyser={audioAnalyser} />

			{/* UI Layer */}
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
						<div className="hidden md:flex items-center gap-2 bg-black/40 border border-white/15 rounded-full px-3 py-1">
							<KeyRound className="w-3.5 h-3.5 opacity-60 text-amber-300" />
							<input
								type="password"
								value={apiKey}
								onChange={(e) => setApiKey(e.target.value)}
								placeholder="Gemini API Key (optional)"
								aria-label="Gemini API Key"
								className="bg-transparent text-xs outline-none w-40 text-white placeholder:text-white/40"
							/>
						</div>
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
						<div className="flex-1 flex flex-col gap-5 justify-center overflow-y-auto">
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
								className="border border-dashed border-white/20 hover:border-amber-400/50 rounded-lg p-6 flex flex-col items-center justify-center text-center opacity-80 hover:opacity-100 transition-all cursor-pointer disabled:opacity-40"
							>
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
								<span className="text-sm">
									{isUploading
										? "Ingesting PDF dossier..."
										: t("Dashboard.uploadDropzone")}
								</span>
							</button>

							{uploadError && (
								<p className="text-xs text-red-400 text-center">
									{uploadError}
								</p>
							)}

							{uploadedDocs.length > 0 && (
								<div className="space-y-1.5 text-xs">
									{uploadedDocs.map((doc) => (
										<div
											key={doc.name}
											className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5"
										>
											<span className="truncate max-w-[180px] opacity-85 flex items-center gap-1.5">
												<CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
												{doc.name}
											</span>
											<span className="text-[10px] opacity-60">
												{doc.chunks} chunks
											</span>
										</div>
									))}
								</div>
							)}

							<div className="border-t border-white/10 pt-4">
								<DocumentRequestForm apiKey={apiKey} />
							</div>
						</div>
					</aside>

					{/* Middle panel: Triggers */}
					<div className="flex-1 flex items-end justify-center pb-12 gap-4 pointer-events-auto">
						<button
							type="button"
							onClick={() => {
								playClick();
								setIsMapOpen(true);
								playWhoosh();
							}}
							className="bg-white/10 text-white px-8 py-3.5 rounded-full backdrop-blur-md border border-white/25 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] cursor-pointer"
						>
							{t("Dashboard.viewMap")}
						</button>
						<button
							type="button"
							onClick={handleSummonMajlis}
							className="bg-amber-500/25 text-amber-300 px-8 py-3.5 rounded-full backdrop-blur-md border border-amber-500/40 hover:bg-amber-500/40 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(245,158,11,0.25)] flex items-center gap-2 cursor-pointer"
						>
							<Sparkles className="w-4 h-4" />
							Summon the Majlis
						</button>
					</div>

					{/* Right panel: Agentic Chat */}
					<aside className="w-96 glass-panel p-5 pointer-events-auto flex flex-col gap-4 relative">
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
										<div
											className={`inline-block px-3.5 py-2 rounded-2xl max-w-[85%] leading-relaxed ${
												msg.role === "user"
													? "bg-white/10 border border-white/10"
													: "bg-black/40 border border-white/5"
											}`}
										>
											<p>{msg.text}</p>
											{msg.role === "oracle" &&
												msg.sources &&
												msg.sources.length > 0 && (
													<div className="flex gap-1.5 mt-2 flex-wrap">
														{msg.sources.map((src, idx) => (
															<button
																key={src.id}
																type="button"
																onClick={() => {
																	playClick();
																	setActiveCitation({
																		title:
																			typeof src.metadata?.source === "string"
																				? src.metadata.source
																				: "UNESCO Archives Reference",
																		content: src.snippet || "",
																		page:
																			typeof src.metadata?.page === "string" ||
																			typeof src.metadata?.page === "number"
																				? src.metadata.page
																				: undefined,
																	});
																	setIsCitationOpen(true);
																	playWhoosh();
																}}
																className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded px-2 py-0.5 hover:bg-amber-500/25 transition-all flex items-center gap-1 cursor-pointer font-semibold uppercase"
															>
																<FileText className="w-2.5 h-2.5" />
																Source [{idx + 1}]
															</button>
														))}
													</div>
												)}
										</div>
									</div>
								))
							)}

							<ThinkingStep
								isThinking={isThinking}
								currentQuery={activeQuery}
							/>
						</div>

						<div className="border-t border-white/10 pt-3">
							<PersonaSelector />
						</div>

						{/* Chat Input Container */}
						<div className="flex gap-2 items-center">
							<div className="relative flex-1 flex items-center">
								<input
									type="text"
									value={chatInput}
									onChange={(e) => setChatInput(e.target.value)}
									onKeyDown={handleKeyPress}
									disabled={isThinking}
									placeholder={t("Dashboard.chatPlaceholder")}
									className="bg-black/50 border border-white/15 rounded-lg pl-4 pr-12 py-2.5 w-full text-sm outline-none focus:border-white/30 transition-colors disabled:opacity-50 text-white"
								/>
								<button
									type="button"
									onClick={() => handleSendChat()}
									disabled={isThinking || !chatInput.trim()}
									className="absolute right-2.5 p-1.5 rounded-md hover:bg-white/10 transition-colors disabled:opacity-30 cursor-pointer"
								>
									<Send className="w-4 h-4 text-white" />
								</button>
							</div>
							<VoiceInput
								onTranscript={(text) => handleSendChat(text)}
								disabled={isThinking}
							/>
						</div>
					</aside>
				</div>
			</div>

			{/* Interactive Citations Drawer */}
			<CitationDrawer
				isOpen={isCitationOpen}
				citation={activeCitation}
				onClose={() => {
					playClick();
					setIsCitationOpen(false);
					playWhoosh();
				}}
			/>

			{/* Interactive Mind Map Canvas Overlay */}
			{isMapOpen && (
				<MindMap
					query={chatHistory[chatHistory.length - 1]?.text}
					apiKey={apiKey}
					onClose={() => {
						playClick();
						setIsMapOpen(false);
						playWhoosh();
					}}
				/>
			)}

			{/* Interactive Majlis Podcast Storytelling Modal Overlay */}
			{isMajlisOpen && (
				<div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col pointer-events-auto text-white">
					<header className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40 backdrop-blur-sm">
						<div>
							<h2 className="text-lg font-bold tracking-wider flex items-center gap-2 text-amber-300">
								<Volume2 className="w-5 h-5 animate-pulse" />
								The Majlis Podcast Studio
							</h2>
							<p className="text-xs opacity-60 mt-0.5">
								Draft, edit, and listen to vocalized conversations
							</p>
						</div>
						<button
							type="button"
							onClick={handleCloseMajlis}
							className="p-2.5 rounded-full border border-white/10 hover:bg-white/10 active:scale-95 transition-all"
							aria-label="Close Majlis"
						>
							<X className="w-4 h-4" />
						</button>
					</header>

					<div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full flex flex-col gap-6">
						{isMajlisDrafting && (
							<div className="flex-1 flex flex-col items-center justify-center gap-3">
								<span className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
								<span className="text-xs tracking-wider text-amber-300 uppercase font-medium">
									Drafting script dialogue...
								</span>
							</div>
						)}

						{!isMajlisDrafting && majlisScript && (
							<>
								<div className="flex flex-col gap-4">
									<h3 className="text-sm opacity-50 uppercase tracking-widest font-semibold">
										Draft Title
									</h3>
									<input
										type="text"
										value={majlisScript.title}
										onChange={(e) =>
											setMajlisScript({
												...majlisScript,
												title: e.target.value,
											})
										}
										className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full text-base outline-none focus:border-amber-400/30 transition-all font-semibold"
									/>
								</div>

								<div className="flex flex-col gap-4">
									<h3 className="text-sm opacity-50 uppercase tracking-widest font-semibold">
										Dialogue Script (Editable)
									</h3>
									<div className="space-y-4">
										{majlisScript.dialogue.map((line, index) => (
											<div
												key={line.id}
												className="flex gap-4 items-start bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all"
											>
												<div className="flex flex-col gap-2">
													<select
														value={line.speaker}
														onChange={(e) =>
															handleScriptChange(
																index,
																"speaker",
																e.target.value,
															)
														}
														className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs outline-none focus:border-amber-400/30 cursor-pointer font-medium"
													>
														<option value="Visitor">Visitor</option>
														<option value="Rawi">Rawi (Oracle)</option>
													</select>
												</div>
												<textarea
													value={line.text}
													rows={2}
													onChange={(e) =>
														handleScriptChange(index, "text", e.target.value)
													}
													className="flex-1 bg-transparent border-0 outline-none text-sm resize-none text-white/90 focus:ring-0 leading-relaxed"
												/>
												<button
													type="button"
													onClick={() => handleDeleteDialogueLine(index)}
													className="p-1.5 rounded-lg border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 active:scale-95 transition-all text-red-400 cursor-pointer"
													aria-label="Delete Line"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										))}
									</div>
								</div>

								{/* Control Panel buttons */}
								<div className="flex justify-between items-center gap-4 mt-2 border-t border-white/10 pt-6 pb-12">
									<button
										type="button"
										onClick={handleAddDialogueLine}
										className="border border-white/15 px-5 py-2.5 rounded-full hover:bg-white/10 active:scale-95 transition-all text-xs font-semibold flex items-center gap-2 cursor-pointer"
									>
										<Plus className="w-4 h-4" />
										Add Dialogue Line
									</button>

									<div className="flex items-center gap-4">
										{audioAnalyser && (
											<div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-full px-4 py-2 text-xs">
												<AudioLines className="w-4 h-4 text-amber-400 animate-pulse" />
												<span className="opacity-80 font-medium">
													Streaming Voice Audio
												</span>
												<button
													type="button"
													onClick={togglePlayPause}
													className="p-1 rounded-full hover:bg-white/10 transition-colors"
												>
													{isPlaying ? (
														<Pause className="w-3.5 h-3.5" />
													) : (
														<Play className="w-3.5 h-3.5" />
													)}
												</button>
												<button
													type="button"
													onClick={stopAudio}
													className="p-1 rounded-full hover:bg-white/10 transition-colors text-red-400"
												>
													<Square className="w-3.5 h-3.5" />
												</button>
											</div>
										)}

										<button
											type="button"
											onClick={handleGenerateAudio}
											disabled={
												isMajlisStreaming || majlisScript.dialogue.length === 0
											}
											className="bg-amber-500 text-black px-6 py-2.5 rounded-full hover:bg-amber-400 disabled:opacity-50 active:scale-95 transition-all text-xs font-bold flex items-center gap-2 cursor-pointer"
										>
											{isMajlisStreaming ? (
												<>
													<span className="w-3 h-3 rounded-full border border-black/20 border-t-black animate-spin" />
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
			)}
		</>
	);
}
