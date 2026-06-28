"use client";

import { useUIStore } from "@/store/useUIStore";

export default function PersonaSelector() {
	const persona = useUIStore((state) => state.persona);
	const setPersona = useUIStore((state) => state.setPersona);

	return (
		<div className="flex flex-col gap-1.5 w-full">
			<span className="text-xs font-semibold opacity-70">Guide Persona</span>
			<div className="grid grid-cols-2 bg-black/40 border border-white/10 rounded-lg p-1">
				<button
					type="button"
					onClick={() => setPersona("STORYTELLER")}
					className={`py-1.5 rounded-md text-xs font-medium transition-all ${
						persona === "STORYTELLER"
							? "bg-white/10 text-white shadow-sm"
							: "text-white/60 hover:text-white"
					}`}
				>
					Storyteller
				</button>
				<button
					type="button"
					onClick={() => setPersona("ACADEMIC")}
					className={`py-1.5 rounded-md text-xs font-medium transition-all ${
						persona === "ACADEMIC"
							? "bg-white/10 text-white shadow-sm"
							: "text-white/60 hover:text-white"
					}`}
				>
					Academic
				</button>
			</div>
		</div>
	);
}
