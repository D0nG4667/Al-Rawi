import Scene from "@/components/canvas/Scene";
import SupportButton from "@/components/ui/SupportButton";

export default function Home() {
	return (
		<main className="relative min-h-[200vh]">
			<Scene />
			<SupportButton />

			{/* UI Layer */}
			<div className="relative z-10 container mx-auto p-6 flex flex-col h-screen pointer-events-none text-white">
				{/* Header */}
				<header className="glass-panel p-5 mb-6 flex justify-between items-center pointer-events-auto">
					<h1 className="text-xl font-bold tracking-wider">Al-Rawi | الراوي</h1>
					<div className="flex items-center gap-3">
						<span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
						<span className="text-sm opacity-80 tracking-wide font-medium">
							Gemini Connected
						</span>
					</div>
				</header>

				{/* Panels Grid */}
				<div className="flex-1 flex gap-6 min-h-0">
					{/* Left panel: Archive Ingestion */}
					<aside className="w-80 glass-panel p-5 pointer-events-auto flex flex-col">
						<h2 className="font-semibold mb-4 text-lg border-b border-white/10 pb-2">
							Archive Ingestion
						</h2>
						<div className="flex-1 border border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
							<svg
								className="w-8 h-8 mb-3 opacity-60"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
							<span className="text-sm">Drag & drop historical PDFs</span>
						</div>
					</aside>

					{/* Middle panel: Map Trigger */}
					<div className="flex-1 flex items-end justify-center pb-12 pointer-events-auto">
						<button
							type="button"
							className="bg-white/10 text-white px-8 py-3.5 rounded-full backdrop-blur-md border border-white/25 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
						>
							Generate Mind Map
						</button>
					</div>

					{/* Right panel: Agentic Chat */}
					<aside className="w-96 glass-panel p-5 pointer-events-auto flex flex-col">
						<h2 className="font-semibold mb-4 text-lg border-b border-white/10 pb-2">
							Historical Guide
						</h2>
						<div className="flex-1 bg-black/30 rounded-lg mb-4 p-4 overflow-y-auto text-sm opacity-80">
							Ask questions about Hegra, At-Turaif, or Historic Jeddah...
						</div>
						<input
							type="text"
							placeholder="Ask Al-Rawi..."
							className="bg-black/50 border border-white/15 rounded-lg px-4 py-2.5 w-full text-sm outline-none focus:border-white/30 transition-colors"
						/>
					</aside>
				</div>
			</div>
		</main>
	);
}
