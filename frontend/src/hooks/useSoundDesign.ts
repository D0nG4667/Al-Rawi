"use client";

import { useRef } from "react";

export function useSoundDesign() {
	const audioCtxRef = useRef<AudioContext | null>(null);

	const initAudio = () => {
		if (!audioCtxRef.current) {
			const AudioCtxClass =
				window.AudioContext ||
				(window as unknown as { webkitAudioContext: typeof AudioContext })
					.webkitAudioContext;
			audioCtxRef.current = new AudioCtxClass();
		}
		if (audioCtxRef.current.state === "suspended") {
			audioCtxRef.current.resume();
		}
	};

	const playClick = () => {
		try {
			initAudio();
			const ctx = audioCtxRef.current;
			if (!ctx) return;

			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = "sine";
			osc.frequency.setValueAtTime(1000, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

			gain.gain.setValueAtTime(0.02, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.start();
			osc.stop(ctx.currentTime + 0.05);
		} catch (e) {
			console.warn("[-] click sound failed:", e);
		}
	};

	const playWhoosh = () => {
		try {
			initAudio();
			const ctx = audioCtxRef.current;
			if (!ctx) return;

			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = "triangle";
			osc.frequency.setValueAtTime(200, ctx.currentTime);
			osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);

			gain.gain.setValueAtTime(0.05, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.start();
			osc.stop(ctx.currentTime + 0.25);
		} catch (e) {
			console.warn("[-] whoosh sound failed:", e);
		}
	};

	const playChime = () => {
		try {
			initAudio();
			const ctx = audioCtxRef.current;
			if (!ctx) return;

			const osc1 = ctx.createOscillator();
			const osc2 = ctx.createOscillator();
			const gain = ctx.createGain();

			osc1.type = "sine";
			osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5

			osc2.type = "sine";
			osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5

			gain.gain.setValueAtTime(0.04, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

			osc1.connect(gain);
			osc2.connect(gain);
			gain.connect(ctx.destination);

			osc1.start();
			osc2.start();
			osc1.stop(ctx.currentTime + 0.8);
			osc2.stop(ctx.currentTime + 0.8);
		} catch (e) {
			console.warn("[-] chime sound failed:", e);
		}
	};

	return {
		playClick,
		playWhoosh,
		playChime,
	};
}
export type UseSoundDesignReturn = ReturnType<typeof useSoundDesign>;
