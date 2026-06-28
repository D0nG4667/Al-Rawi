"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";

// Boundaries matching UNESCO coordinates (Hegra bounding box coordinates example)
const HEGRA_BOUNDS = {
	minLat: 26.78,
	maxLat: 26.82,
	minLng: 37.94,
	maxLng: 37.98,
};

export function useGeofence() {
	const setFocusNode = useUIStore((state) => state.setFocusNode);

	useEffect(() => {
		if (typeof window === "undefined" || !("geolocation" in navigator)) {
			return;
		}

		const watchId = navigator.geolocation.watchPosition(
			(position) => {
				const { latitude, longitude } = position.coords;

				// Verify if current coordinates match Hegra boundaries
				if (
					latitude >= HEGRA_BOUNDS.minLat &&
					latitude <= HEGRA_BOUNDS.maxLat &&
					longitude >= HEGRA_BOUNDS.minLng &&
					longitude <= HEGRA_BOUNDS.maxLng
				) {
					// Auto pan camera focus coordinates to Hegra archaeological focal points
					setFocusNode("hegra", [0, 1.5, 5]);
				}
			},
			(error) => {
				console.warn("Geofencing watch failed:", error.message);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			},
		);

		return () => navigator.geolocation.clearWatch(watchId);
	}, [setFocusNode]);
}
