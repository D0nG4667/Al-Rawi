"use client";

import { Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VoiceInputProps {
	onTranscript: (text: string) => void;
	disabled?: boolean;
}

interface ISpeechRecognitionEvent {
	results: {
		[index: number]: {
			[index: number]: {
				transcript: string;
			};
		};
	};
}

interface ISpeechRecognition {
	continuous: boolean;
	interimResults: boolean;
	lang: string;
	onresult: ((event: ISpeechRecognitionEvent) => void) | null;
	onerror: ((event: unknown) => void) | null;
	onend: (() => void) | null;
	start: () => void;
	stop: () => void;
}

export default function VoiceInput({
	onTranscript,
	disabled,
}: VoiceInputProps): React.ReactElement {
	const [isListening, setIsListening] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const recognitionRef = useRef<ISpeechRecognition | null>(null);
	const animationRef = useRef<number | null>(null);

	useEffect(() => {
		const SpeechRecognition =
			(
				window as unknown as {
					SpeechRecognition?: new () => ISpeechRecognition;
				}
			).SpeechRecognition ||
			(
				window as unknown as {
					webkitSpeechRecognition?: new () => ISpeechRecognition;
				}
			).webkitSpeechRecognition;

		if (SpeechRecognition) {
			const rec = new SpeechRecognition();
			rec.continuous = false;
			rec.interimResults = false;
			rec.lang = document.documentElement.lang === "ar" ? "ar-SA" : "en-US";

			rec.onresult = (event: ISpeechRecognitionEvent) => {
				const text = event.results[0][0].transcript;
				if (text) {
					onTranscript(text);
				}
				setIsListening(false);
			};

			rec.onerror = (event: unknown) => {
				console.error("[-] Speech recognition error:", event);
				setIsListening(false);
			};

			rec.onend = () => {
				setIsListening(false);
			};

			recognitionRef.current = rec;
		}

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [onTranscript]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let phase = 0;

		const render = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.lineWidth = 1.5;

			for (let i = 0; i < 3; i++) {
				ctx.beginPath();
				const offset = i * (Math.PI / 3);
				const alpha = 0.25 + (1 - i / 3) * 0.55;
				ctx.strokeStyle = `rgba(217, 164, 65, ${alpha})`;

				for (let x = 0; x < canvas.width; x++) {
					const angle = (x / canvas.width) * Math.PI * 4 + phase + offset;
					const y =
						canvas.height / 2 +
						Math.sin(angle) * (canvas.height * 0.35) * Math.sin(phase * 0.5);
					if (x === 0) {
						ctx.moveTo(x, y);
					} else {
						ctx.lineTo(x, y);
					}
				}
				ctx.stroke();
			}

			phase += 0.15;
			animationRef.current = requestAnimationFrame(render);
		};

		if (isListening) {
			render();
		} else {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
				animationRef.current = null;
			}
		}
	}, [isListening]);

	const toggleListening = (): void => {
		if (isListening) {
			recognitionRef.current?.stop();
			setIsListening(false);
		} else {
			if (!recognitionRef.current) {
				alert("Speech recognition is not supported in this browser.");
				return;
			}
			setIsListening(true);
			recognitionRef.current.start();
		}
	};

	return (
		<div className="flex items-center gap-2">
			{isListening && (
				<canvas
					ref={canvasRef}
					width={96}
					height={32}
					className="h-8 w-24 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-full overflow-hidden"
				/>
			)}
			<button
				type="button"
				onClick={toggleListening}
				disabled={disabled}
				aria-label={
					isListening ? "Stop voice input" : "Start voice narration input"
				}
				className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
					isListening
						? "bg-[var(--accent-terracotta-soft)] border-[var(--accent-terracotta)] text-[var(--accent-terracotta)] animate-pulse"
						: "border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
				} disabled:opacity-30`}
				title={isListening ? "Listening... click to stop" : "Start Voice Input"}
			>
				{isListening ? (
					<MicOff className="w-4 h-4" />
				) : (
					<Mic className="w-4 h-4" />
				)}
			</button>
		</div>
	);
}
