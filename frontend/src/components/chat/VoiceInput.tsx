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
}: VoiceInputProps) {
	const [isListening, setIsListening] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const recognitionRef = useRef<ISpeechRecognition | null>(null);
	const animationRef = useRef<number | null>(null);

	useEffect(() => {
		// Initialize browser SpeechRecognition
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
			rec.lang = "en-US"; // Default language

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

	// Sine wave canvas animation loop when listening
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let phase = 0;

		const render = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.lineWidth = 1.5;

			// Draw 3 layered offset sine waves for premium aesthetic
			for (let i = 0; i < 3; i++) {
				ctx.beginPath();
				const offset = i * (Math.PI / 3);
				const alpha = 0.2 + (1 - i / 3) * 0.5;
				ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`; // amber-500

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

	const toggleListening = () => {
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
		<div className="flex items-center gap-3">
			{isListening && (
				<canvas
					ref={canvasRef}
					width={120}
					height={32}
					className="h-8 w-28 bg-black/20 border border-white/5 rounded-full overflow-hidden"
				/>
			)}
			<button
				type="button"
				onClick={toggleListening}
				disabled={disabled}
				className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
					isListening
						? "bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.25)]"
						: "border-white/15 hover:bg-white/10 text-white/80"
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
