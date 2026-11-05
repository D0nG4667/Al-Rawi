export type VoiceLocale = "en" | "ar";

/** Speaks dialogue lines with the Web Speech API. Returns false if unsupported. */
export function speakWithBrowserVoice(
	lines: readonly { text: string }[],
	locale: VoiceLocale,
	onEnd: () => void,
): boolean {
	if (typeof window === "undefined" || !("speechSynthesis" in window)) {
		return false;
	}
	window.speechSynthesis.cancel();
	lines.forEach((line, index) => {
		const utterance = new SpeechSynthesisUtterance(line.text);
		utterance.lang = locale === "ar" ? "ar-SA" : "en-US";
		if (index === lines.length - 1) utterance.onend = onEnd;
		window.speechSynthesis.speak(utterance);
	});
	return true;
}

export function stopBrowserVoice(): void {
	if (typeof window !== "undefined" && "speechSynthesis" in window) {
		window.speechSynthesis.cancel();
	}
}
