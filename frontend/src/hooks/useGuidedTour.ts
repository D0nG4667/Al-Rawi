"use client";

import { useCallback, useEffect, useState } from "react";
import { TOUR_STEPS, TOUR_STORAGE_KEY } from "@/lib/tourSteps";

export interface GuidedTourState {
	stepIndex: number;
	isActive: boolean;
	start: () => void;
	next: () => void;
	back: () => void;
	skip: () => void;
}

/** First-run tour state, remembered in localStorage once finished or skipped. */
export function useGuidedTour(autoStart: boolean): GuidedTourState {
	const [stepIndex, setStepIndex] = useState(0);
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		if (!autoStart) return;
		try {
			if (window.localStorage.getItem(TOUR_STORAGE_KEY) === "done") return;
		} catch {
			return;
		}
		setStepIndex(0);
		setIsActive(true);
	}, [autoStart]);

	const finish = useCallback((): void => {
		setIsActive(false);
		try {
			window.localStorage.setItem(TOUR_STORAGE_KEY, "done");
		} catch {
			// Storage unavailable (private mode): the tour simply shows again next visit.
		}
	}, []);

	const start = useCallback((): void => {
		setStepIndex(0);
		setIsActive(true);
	}, []);

	const next = useCallback((): void => {
		if (stepIndex >= TOUR_STEPS.length - 1) {
			finish();
			return;
		}
		setStepIndex(stepIndex + 1);
	}, [stepIndex, finish]);

	const back = useCallback((): void => {
		setStepIndex((index) => Math.max(0, index - 1));
	}, []);

	return { stepIndex, isActive, start, next, back, skip: finish };
}
