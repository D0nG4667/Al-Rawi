import { create } from "zustand";

interface UIState {
	activeHistoricalNode: string | null;
	cameraCoordinates: [number, number, number];
	isAIThinking: boolean;
	setFocusNode: (node: string | null, coords: [number, number, number]) => void;
	setAIThinking: (isThinking: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
	activeHistoricalNode: null,
	cameraCoordinates: [0, 2, 8],
	isAIThinking: false,
	setFocusNode: (node, coords) =>
		set({ activeHistoricalNode: node, cameraCoordinates: coords }),
	setAIThinking: (isThinking) => set({ isAIThinking: isThinking }),
}));
