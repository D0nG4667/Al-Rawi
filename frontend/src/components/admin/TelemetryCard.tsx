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
}: TelemetryCardProps) {
	const statusColors = {
		healthy: "bg-green-500 shadow-[0_0_8px_#22c55e]",
		warning: "bg-amber-500 shadow-[0_0_8px_#f59e0b]",
		error: "bg-red-500 shadow-[0_0_8px_#ef4444]",
	};

	return (
		<div className="glass-panel p-5 flex flex-col gap-3 min-w-[200px]">
			<div className="flex justify-between items-start gap-2">
				<span className="text-xs font-semibold opacity-60 tracking-wider uppercase">
					{title}
				</span>
				<span className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-2xl font-bold tracking-tight text-white">
					{value}
				</span>
				<span className="text-xs opacity-50">{description}</span>
			</div>
		</div>
	);
}
