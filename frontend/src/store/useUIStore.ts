import { create } from "zustand";

interface UIState {
	activeHistoricalNode: string | null;
	cameraCoordinates: [number, number, number];
	isAIThinking: boolean;
	persona: "STORYTELLER" | "ACADEMIC";
	setFocusNode: (node: string | null, coords: [number, number, number]) => void;
	setAIThinking: (isThinking: boolean) => void;
	setPersona: (persona: "STORYTELLER" | "ACADEMIC") => void;
}

export const useUIStore = create<UIState>((set) => ({
	activeHistoricalNode: null,
	cameraCoordinates: [0, 2, 8],
	isAIThinking: false,
	persona: "STORYTELLER",
	setFocusNode: (node, coords) =>
		set({ activeHistoricalNode: node, cameraCoordinates: coords }),
	setAIThinking: (isThinking) => set({ isAIThinking: isThinking }),
	setPersona: (persona) => set({ persona }),
}));
