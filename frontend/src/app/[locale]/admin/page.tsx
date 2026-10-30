import Link from "next/link";
import IngestionControl from "@/components/admin/IngestionControl";

export default async function AdminPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	return (
		<main className="min-h-screen bg-[#0B0C10] text-white p-8 flex flex-col gap-6">
			<header className="glass-panel p-6 flex justify-between items-center">
				<div>
					<h1 className="text-xl font-bold tracking-wider">
						Admin Control Panel
					</h1>
					<p className="text-xs opacity-60 mt-0.5">
						Heritage Archive Ingestion & System Telemetry
					</p>
				</div>
				<Link
					href={`/${locale}`}
					className="text-xs border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 transition-all font-medium"
				>
					Back to Explore
				</Link>
			</header>

			<IngestionControl />

			<section className="glass-panel p-6 flex-1 flex flex-col gap-4">
				<h2 className="text-sm font-semibold tracking-wider uppercase opacity-70 border-b border-white/10 pb-2">
					Ingestion Activity Log
				</h2>
				<div className="flex flex-col gap-3.5 text-xs">
					<div className="flex justify-between items-center border-b border-white/5 pb-2">
						<span className="opacity-80">Hegra Tomb 12 Dossier.pdf</span>
						<span className="text-green-400 font-semibold">Processed</span>
					</div>
					<div className="flex justify-between items-center border-b border-white/5 pb-2">
						<span className="opacity-80">
							UNESCO AlUla Nomination Report.pdf
						</span>
						<span className="text-green-400 font-semibold">Processed</span>
					</div>
					<div className="flex justify-between items-center pb-2">
						<span className="opacity-80">
							Diriyah Architectural Blueprint.pdf
						</span>
						<span className="text-green-400 font-semibold">Processed</span>
					</div>
				</div>
			</section>
		</main>
	);
}
