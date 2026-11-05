import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import IngestionControl from "@/components/admin/IngestionControl";
import HeritageOrnament from "@/components/ui/HeritageOrnament";

const ARCHIVE_LEDGER = [
	{
		file: "Hegra Tomb 12 Dossier.pdf",
		source: "UNESCO #1293 · AlUla",
		chunks: 412,
		status: "Processed",
	},
	{
		file: "UNESCO AlUla Nomination Report.pdf",
		source: "Royal Commission for AlUla",
		chunks: 1284,
		status: "Processed",
	},
	{
		file: "Diriyah Architectural Blueprint.pdf",
		source: "UNESCO #1329 · DGDA",
		chunks: 876,
		status: "Processed",
	},
];

export default async function AdminPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
	const { locale } = await params;

	return (
		<main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-6 sm:p-10 flex flex-col gap-6 max-w-7xl mx-auto w-full">
			<header className="glass-panel overflow-hidden">
				<HeritageOrnament variant="najdi-band" />
				<div className="p-6 flex flex-wrap justify-between items-center gap-4">
					<div className="flex items-center gap-3.5">
						<div className="p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
							<HeritageOrnament variant="astrolabe" className="w-8 h-8" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-xl font-display font-bold tracking-wide">
									Admin Control Panel
								</h1>
								<span className="text-[10px] font-mono-tabular px-2.5 py-0.5 rounded-full heritage-chip flex items-center gap-1">
									<ShieldCheck className="w-3 h-3" />
									RLS Authority
								</span>
							</div>
							<p className="text-xs text-[var(--text-secondary)] mt-0.5">
								Heritage Archive Ingestion & System Telemetry
							</p>
						</div>
					</div>
					<Link
						href={`/${locale}/explore`}
						className="text-xs manuscript-card px-4 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:border-[var(--border-strong)] transition-all"
					>
						<ArrowLeft className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
						Back to Explore
					</Link>
				</div>
			</header>

			<IngestionControl />

			<section className="glass-panel p-6 flex-1 flex flex-col gap-4">
				<div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
					<h2 className="text-xs font-mono-tabular font-semibold tracking-widest uppercase text-[var(--text-secondary)]">
						Ingestion Activity Log
					</h2>
					<span className="text-[10px] font-mono-tabular text-[var(--text-muted)]">
						pgvector HNSW Index · 768d Gemini Embeddings
					</span>
				</div>
				<div className="flex flex-col gap-3 text-xs">
					{ARCHIVE_LEDGER.map((entry) => (
						<div
							key={entry.file}
							className="manuscript-card px-4 py-3 flex flex-wrap justify-between items-center gap-3"
						>
							<div className="flex items-center gap-2.5">
								<CheckCircle2 className="w-4 h-4 text-[var(--accent-oasis)] shrink-0" />
								<div>
									<span className="font-semibold text-[var(--text-primary)] block">
										{entry.file}
									</span>
									<span className="text-[10px] font-mono-tabular text-[var(--text-muted)]">
										{entry.source}
									</span>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<span className="text-[11px] font-mono-tabular text-[var(--accent-gold)]">
									{entry.chunks} chunks
								</span>
								<span className="text-[11px] font-mono-tabular text-[var(--accent-oasis)] font-semibold">
									{entry.status}
								</span>
							</div>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
