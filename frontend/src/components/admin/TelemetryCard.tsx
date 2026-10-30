import type React from "react";
import HeritageOrnament from "@/components/ui/HeritageOrnament";

interface TelemetryCardProps {
	title: string;
	value: string | number;
	description: string;
	status?: "healthy" | "warning" | "error";
}

export default function TelemetryCard({
	title,
	value,
	description,
	status = "healthy",
}: TelemetryCardProps): React.ReactElement {
	const statusColors = {
		healthy: "bg-[var(--accent-oasis)] shadow-[0_0_8px_var(--accent-oasis)]",
		warning: "bg-[var(--accent-gold)] shadow-[0_0_8px_var(--accent-gold)]",
		error:
			"bg-[var(--accent-terracotta)] shadow-[0_0_8px_var(--accent-terracotta)]",
	};

	return (
		<div className="manuscript-card p-5 flex flex-col gap-3 min-w-[200px]">
			<div className="flex justify-between items-start gap-2">
				<span className="text-[11px] font-mono-tabular font-semibold text-[var(--text-secondary)] tracking-widest uppercase flex items-center gap-1.5">
					<HeritageOrnament variant="corner-rosette" className="w-3 h-3" />
					{title}
				</span>
				<span className={`w-2.5 h-2.5 rounded-full ${statusColors[status]}`} />
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-2xl font-mono-tabular font-bold tracking-tight text-[var(--text-primary)]">
					{value}
				</span>
				<span className="text-xs text-[var(--text-muted)]">{description}</span>
			</div>
		</div>
	);
}
