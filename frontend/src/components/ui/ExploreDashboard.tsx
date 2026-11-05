"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import Scene from "@/components/canvas/Scene";
import CitationDrawer, {
	type CitationData,
} from "@/components/chat/CitationDrawer";
import ArchiveSheet from "@/components/explore/ArchiveSheet";
import ExploreTopBar from "@/components/explore/ExploreTopBar";
import MajlisStudioModal from "@/components/explore/MajlisStudioModal";
import OracleCommandBar from "@/components/explore/OracleCommandBar";
import OracleSheet from "@/components/explore/OracleSheet";
import SiteHotspotBar from "@/components/explore/SiteHotspotBar";
import type {
	ChatMessage,
	ChatSource,
	DialogueLine,
	PodcastScript,
	UploadedDoc,
} from "@/components/explore/types";
import GuidedTour from "@/components/onboarding/GuidedTour";
import HeritageOrnament from "@/components/ui/HeritageOrnament";
import MindMap from "@/components/ui/MindMap";
import { useGeofence } from "@/hooks/useGeofence";
import { useGuidedTour } from "@/hooks/useGuidedTour";
import { useSoundDesign } from "@/hooks/useSoundDesign";
import { speakWithBrowserVoice, stopBrowserVoice } from "@/lib/browserVoice";
import { buildDemoMajlisScript } from "@/lib/demo/demoMajlis";
import type { ExploreParams } from "@/lib/exploreParams";
import { askOracle, OracleRequestError } from "@/lib/oracleClient";
import { TOUR_STEPS } from "@/lib/tourSteps";
import { HERITAGE_SITES, useUIStore } from "@/store/useUIStore";

interface ExploreDashboardProps {
	locale: string;
	initialParams?: ExploreParams;
}

export default function ExploreDashboard({
	locale,
	initialParams,
}: ExploreDashboardProps): React.ReactElement {
	// Activate geolocation-based UNESCO geofencing
	useGeofence();

	// Global UI Store
	const persona = useUIStore((state) => state.persona);
	const setPersona = useUIStore((state) => state.setPersona);
	const setAIThinking = useUIStore((state) => state.setAIThinking);
	const activeDrawer = useUIStore((state) => state.activeDrawer);
	const setActiveDrawer = useUIStore((state) => state.setActiveDrawer);
	const activeSite = useUIStore((state) => state.activeSite);
	const setActiveSite = useUIStore((state) => state.setActiveSite);
	const tDemo = useTranslations("Demo");
	const langKey: "en" | "ar" = locale === "ar" ? "ar" : "en";

	// Modal states
	const [isMapOpen, setIsMapOpen] = useState(false);
	const [isMajlisOpen, setIsMajlisOpen] = useState(false);

	// Optional Client API Key & File Upload states
	const [apiKey, setApiKey] = useState("");
	const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState("");

	// Chat states
	const [chatInput, setChatInput] = useState("");
	const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
	const lastOracleOrigin = [...chatHistory]
		.reverse()
		.find((msg) => msg.role === "oracle")?.origin;
	const [isThinking, setIsThinking] = useState(false);
	const [activeQuery, setActiveQuery] = useState("");
	const commandInputRef = useRef<HTMLInputElement | null>(null);

	// Citation States
	const [activeCitation, setActiveCitation] = useState<CitationData | null>(
		null,
	);
	const [isCitationOpen, setIsCitationOpen] = useState(false);

	// UI Sound Design
	const { playClick, playWhoosh, playChime } = useSoundDesign();

	// Majlis/Audio states
	const [isMajlisDrafting, setIsMajlisDrafting] = useState(false);
	const [isMajlisStreaming, setIsMajlisStreaming] = useState(false);
	const [majlisScript, setMajlisScript] = useState<PodcastScript | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [audioAnalyser, setAudioAnalyser] = useState<AnalyserNode | null>(null);
	const [majlisNotice, setMajlisNotice] = useState("");
	const [isBrowserVoiceActive, setIsBrowserVoiceActive] = useState(false);
	const isBrowserVoiceRef = useRef(false);

	// Audio element & context references
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const audioCtxRef = useRef<AudioContext | null>(null);

	// Cinematic Entry Preloader State
	const [isPreloading, setIsPreloading] = useState(true);
	const tour = useGuidedTour(!isPreloading);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsPreloading(false);
		}, 1200);
		return () => clearTimeout(timer);
	}, []);

	// Apply validated deep-link params once (/explore?site=&persona=&q=)
	const appliedParamsRef = useRef(false);
	useEffect(() => {
		if (appliedParamsRef.current || !initialParams) return;
		appliedParamsRef.current = true;
		if (initialParams.site) setActiveSite(initialParams.site);
		if (initialParams.persona) setPersona(initialParams.persona);
		if (initialParams.query) setChatInput(initialParams.query);
	}, [initialParams, setActiveSite, setPersona]);

	// Global keyboard navigation: Cmd/Ctrl+K (focus prompt), [ (Archive), ] (Oracle), Esc (close sheets)
	useEffect(() => {
		const handleGlobalKeyDown = (e: globalThis.KeyboardEvent): void => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				commandInputRef.current?.focus();
				return;
			}

			const target = e.target as HTMLElement | null;
			const isTyping =
				target?.tagName === "INPUT" ||
				target?.tagName === "TEXTAREA" ||
				target?.tagName === "SELECT" ||
				target?.isContentEditable;

			if (e.key === "Escape") {
				if (isCitationOpen) {
					setIsCitationOpen(false);
				} else if (isMapOpen) {
					setIsMapOpen(false);
				} else if (isMajlisOpen) {
					setIsMajlisOpen(false);
				} else if (activeDrawer !== null) {
					setActiveDrawer(null);
				}
				return;
			}

			if (isTyping) return;

			if (e.key === "[") {
				e.preventDefault();
				setActiveDrawer(activeDrawer === "archive" ? null : "archive");
			} else if (e.key === "]") {
				e.preventDefault();
				setActiveDrawer(activeDrawer === "oracle" ? null : "oracle");
			}
		};

		window.addEventListener("keydown", handleGlobalKeyDown);
		return () => window.removeEventListener("keydown", handleGlobalKeyDown);
	}, [activeDrawer, isCitationOpen, isMajlisOpen, isMapOpen, setActiveDrawer]);

	const stopAudio = useCallback((): void => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current = null;
		}
		if (audioCtxRef.current) {
			audioCtxRef.current.close();
			audioCtxRef.current = null;
		}
		stopBrowserVoice();
		isBrowserVoiceRef.current = false;
		setIsBrowserVoiceActive(false);
		setAudioAnalyser(null);
		setIsPlaying(false);
	}, []);

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
				if (res.status >= 500) throw new Error(tDemo("uploadUnavailable"));
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
				err instanceof TypeError
					? tDemo("uploadUnavailable")
					: err instanceof Error
						? err.message
						: tDemo("uploadUnavailable"),
			);
		} finally {
			setIsUploading(false);
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
		setActiveDrawer("oracle");
		if (tour.isActive && TOUR_STEPS[tour.stepIndex]?.id === "ask") {
			tour.next();
		}
		setChatHistory((prev) => [
			...prev.map((m) => ({ ...m, isNew: false })),
			{ id: `user-${Date.now()}`, role: "user", text: query },
		]);
		setIsThinking(true);
		setAIThinking(true);

		try {
			const result = await askOracle({
				query,
				persona,
				site: activeSite,
				locale: langKey,
				apiKey: apiKey.trim() || undefined,
			});
			setChatHistory((prev) => [
				...prev,
				{
					id: `oracle-${Date.now()}`,
					role: "oracle",
					text: result.answer,
					sources: result.sources,
					origin: result.origin,
					isNew: true,
				},
			]);
			playChime();
		} catch (error: unknown) {
			const status = error instanceof OracleRequestError ? error.status : 0;
			const message =
				status === 401 || status === 403
					? tDemo("errorAuth")
					: status === 429
						? tDemo("errorRateLimit")
						: tDemo("errorGeneric");
			setChatHistory((prev) => [
				...prev,
				{
					id: `error-${Date.now()}`,
					role: "oracle",
					text: message,
					isNew: true,
				},
			]);
		} finally {
			setIsThinking(false);
			setAIThinking(false);
		}
	};

	const handleSelectSource = (src: ChatSource): void => {
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
			url: typeof src.metadata?.url === "string" ? src.metadata.url : undefined,
			origin: src.metadata?.origin === "demo" ? "demo" : "live",
		});
		setIsCitationOpen(true);
		playWhoosh();
	};

	const handleSummonMajlis = async (): Promise<void> => {
		playClick();
		setIsMajlisOpen(true);
		playWhoosh();
		setIsMajlisDrafting(true);
		setMajlisScript(null);
		setMajlisNotice("");
		stopAudio();

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
			console.error(
				"[-] Majlis draft failed, using Demo Archive script:",
				error,
			);
			setMajlisScript(buildDemoMajlisScript(activeSite, langKey));
		} finally {
			setIsMajlisDrafting(false);
		}
	};

	const handleScriptLineChange = (
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
		setMajlisScript({
			...majlisScript,
			dialogue: majlisScript.dialogue.filter((_, i) => i !== index),
		});
	};

	const handleGenerateAudio = async (): Promise<void> => {
		if (!majlisScript) return;
		setIsMajlisStreaming(true);
		stopAudio();
		setMajlisNotice("");

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
			console.error("[-] Vocalization failed, using browser voice:", error);
			const spoke = speakWithBrowserVoice(
				majlisScript.dialogue,
				langKey,
				() => {
					isBrowserVoiceRef.current = false;
					setIsBrowserVoiceActive(false);
					setIsPlaying(false);
				},
			);
			if (spoke) {
				isBrowserVoiceRef.current = true;
				setIsBrowserVoiceActive(true);
				setIsPlaying(true);
				setMajlisNotice(tDemo("audioFallback"));
			} else {
				setMajlisNotice(tDemo("errorGeneric"));
			}
		} finally {
			setIsMajlisStreaming(false);
		}
	};

	const togglePlayPause = (): void => {
		if (isBrowserVoiceRef.current) {
			if (isPlaying) {
				window.speechSynthesis.pause();
			} else {
				window.speechSynthesis.resume();
			}
			setIsPlaying(!isPlaying);
			return;
		}
		if (!audioRef.current) return;
		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(false);
		} else {
			audioRef.current.play();
			setIsPlaying(true);
		}
	};

	return (
		<>
			{/* Cinematic Manuscript Entry Preloader */}
			{isPreloading && (
				<div className="fixed inset-0 z-50 bg-[var(--bg-canvas)] flex flex-col items-center justify-center text-[var(--text-primary)] select-none pointer-events-auto">
					<div className="flex flex-col items-center gap-6">
						<div className="w-20 h-20 rounded-full manuscript-card border border-[var(--border-strong)] flex items-center justify-center animate-pulse">
							<HeritageOrnament variant="astrolabe" className="w-11 h-11" />
						</div>
						<div className="text-center space-y-2">
							<h1 className="text-2xl font-display font-bold tracking-[0.18em] uppercase text-[var(--accent-gold)]">
								الراوي · AL-RAWI
							</h1>
							<p className="text-xs text-[var(--text-secondary)] tracking-wider">
								Illuminated Saudi Heritage & AI Oracle
							</p>
						</div>
					</div>
					<div className="absolute bottom-10 text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em] font-mono-tabular">
						Calibrating 3D Spatial Chronicle
					</div>
				</div>
			)}

			{/* Full-Bleed WebGL 3D Scene */}
			<Scene audioAnalyser={audioAnalyser} />

			{/* Canvas-First Floating HUD Layer */}
			<div className="relative z-10 h-dvh w-full p-4 sm:p-6 flex flex-col justify-between pointer-events-none">
				<ExploreTopBar
					locale={locale}
					isDemo={lastOracleOrigin === "demo"}
					uploadedCount={uploadedDocs.length}
					messageCount={chatHistory.length}
					onOpenMap={() => {
						playClick();
						setIsMapOpen(true);
						playWhoosh();
					}}
					onSummonMajlis={handleSummonMajlis}
					onInteractionSound={playClick}
					onStartTour={tour.start}
				/>

				<div className="flex-1 flex items-center justify-start my-4 pointer-events-none">
					<SiteHotspotBar
						locale={locale}
						onAskHotspot={(inquiry) => handleSendChat(inquiry)}
						onInteractionSound={playClick}
					/>
				</div>

				<OracleCommandBar
					locale={locale}
					chatInput={chatInput}
					isThinking={isThinking}
					apiKey={apiKey}
					inputRef={commandInputRef}
					onChatInputChange={setChatInput}
					onSendChat={handleSendChat}
					onApiKeyChange={setApiKey}
				/>
			</div>

			{/* Slide-Over Archive Dossier & Ingestion Sheet */}
			<ArchiveSheet
				locale={locale}
				isOpen={activeDrawer === "archive"}
				uploadedDocs={uploadedDocs}
				isUploading={isUploading}
				uploadError={uploadError}
				apiKey={apiKey}
				onClose={() => {
					playClick();
					setActiveDrawer(null);
				}}
				onFileUpload={handleFileUpload}
				onAskDossier={(prompt) => handleSendChat(prompt)}
			/>

			{/* Slide-Over Illuminated Oracle Chronicle Sheet */}
			<OracleSheet
				locale={locale}
				isOpen={activeDrawer === "oracle"}
				chatHistory={chatHistory}
				isThinking={isThinking}
				activeQuery={activeQuery}
				onClose={() => {
					playClick();
					setActiveDrawer(null);
				}}
				onSelectSource={handleSelectSource}
				onOpenMap={() => {
					playClick();
					setIsMapOpen(true);
					playWhoosh();
				}}
				onSendPrompt={(prompt) => handleSendChat(prompt)}
			/>

			{/* Interactive Citations Folio Drawer */}
			<CitationDrawer
				isOpen={isCitationOpen}
				citation={activeCitation}
				onClose={() => {
					playClick();
					setIsCitationOpen(false);
					playWhoosh();
				}}
			/>

			{/* Interactive Knowledge Graph Overlay */}
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

			{/* Interactive Majlis Podcast Studio Overlay */}
			<MajlisStudioModal
				isOpen={isMajlisOpen}
				isDrafting={isMajlisDrafting}
				isStreaming={isMajlisStreaming}
				isPlaying={isPlaying}
				script={majlisScript}
				hasAudioAnalyser={Boolean(audioAnalyser) || isBrowserVoiceActive}
				notice={majlisNotice}
				onClose={() => {
					playClick();
					stopAudio();
					setIsMajlisOpen(false);
					playWhoosh();
					setMajlisScript(null);
				}}
				onTitleChange={(title) => {
					if (majlisScript) {
						setMajlisScript({ ...majlisScript, title });
					}
				}}
				onLineChange={handleScriptLineChange}
				onAddLine={handleAddDialogueLine}
				onDeleteLine={handleDeleteDialogueLine}
				onGenerateAudio={handleGenerateAudio}
				onTogglePlayPause={togglePlayPause}
				onStopAudio={stopAudio}
			/>

			<GuidedTour
				tour={tour}
				onAskForMe={() =>
					handleSendChat(
						chatInput.trim() ||
							HERITAGE_SITES[activeSite].prompts[persona][langKey][0],
					)
				}
			/>
		</>
	);
}
