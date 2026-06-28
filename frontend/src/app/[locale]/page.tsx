import Scene from "@/components/canvas/Scene";
import SupportButton from "@/components/ui/SupportButton";
import DocumentRequestForm from "@/components/ui/DocumentRequestForm";
import PersonaSelector from "@/components/ui/PersonaSelector";
import { getTranslations } from "next-intl/server";

export default async function Home({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations();

	const switchLocale = locale === "en" ? "ar" : "en";
	const switchLabel = locale === "en" ? "العربية" : "English";

	return (
		<main className="relative min-h-[200vh]">
			<Scene />
			<SupportButton />

			{/* UI Layer */}
			<div className="relative z-10 container mx-auto p-6 flex flex-col h-screen pointer-events-none text-white">
				{/* Header */}
				<header className="glass-panel p-5 mb-6 flex justify-between items-center pointer-events-auto">
					<div>
						<h1 className="text-xl font-bold tracking-wider">
							{t("Common.title")}
						</h1>
						<p className="text-xs opacity-60 mt-0.5">{t("Common.subtitle")}</p>
					</div>
					<div className="flex items-center gap-4">
						<a
							href={`/${switchLocale}`}
							className="text-xs border border-white/20 rounded-full px-3.5 py-1.5 hover:bg-white/10 transition-all font-medium"
						>
							{switchLabel}
						</a>
						<div className="flex items-center gap-2">
							<span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
							<span className="text-xs opacity-80 tracking-wide font-medium">
								Gemini Connected
							</span>
						</div>
					</div>
				</header>

				{/* Panels Grid */}
				<div className="flex-1 flex gap-6 min-h-0">
					{/* Left panel: Archive Ingestion */}
					<aside className="w-80 glass-panel p-5 pointer-events-auto flex flex-col">
						<h2 className="font-semibold mb-4 text-lg border-b border-white/10 pb-2">
							{t("Dashboard.uploadTitle")}
						</h2>
						<div className="flex-1 flex flex-col gap-6 justify-center">
							<div className="border border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center text-center opacity-70">
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
								<span className="text-sm">{t("Dashboard.uploadDropzone")}</span>
							</div>

							<div className="border-t border-white/10 pt-4">
								<DocumentRequestForm />
							</div>
						</div>
					</aside>

					{/* Middle panel: Map Trigger */}
					<div className="flex-1 flex items-end justify-center pb-12 pointer-events-auto">
						<button
							type="button"
							className="bg-white/10 text-white px-8 py-3.5 rounded-full backdrop-blur-md border border-white/25 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
						>
							{t("Dashboard.viewMap")}
						</button>
					</div>

					{/* Right panel: Agentic Chat */}
					<aside className="w-96 glass-panel p-5 pointer-events-auto flex flex-col gap-4">
						<h2 className="font-semibold text-lg border-b border-white/10 pb-2">
							Oracle Guide
						</h2>
						<div className="flex-1 bg-black/30 rounded-lg p-4 overflow-y-auto text-sm opacity-80">
							{t("Common.tagline")}
						</div>
						<div className="border-t border-white/10 pt-3">
							<PersonaSelector />
						</div>
						<input
							type="text"
							placeholder={t("Dashboard.chatPlaceholder")}
							className="bg-black/50 border border-white/15 rounded-lg px-4 py-2.5 w-full text-sm outline-none focus:border-white/30 transition-colors"
						/>
					</aside>
				</div>
			</div>
		</main>
	);
}
