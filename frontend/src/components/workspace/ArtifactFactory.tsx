import type React from "react";

export type ArtifactType = "MINDMAP" | "AUDIO" | "3D_MODEL" | "PDF";

interface ArtifactProps {
	type: ArtifactType;
	title: string;
	contentUrl?: string;
}

export default function ArtifactFactory({
	type,
	title,
	contentUrl,
}: ArtifactProps) {
	switch (type) {
		case "MINDMAP":
			return (
				<div className="p-4 border border-white/10 rounded-lg bg-white/5 flex flex-col gap-2">
					<h3 className="font-semibold text-sm">{title}</h3>
					<p className="text-xs opacity-65">Historical Mind Map View</p>
					{contentUrl && (
						<a
							href={contentUrl}
							className="text-xs text-blue-400 hover:underline"
						>
							View Data Source
						</a>
					)}
				</div>
			);

		case "AUDIO":
			return (
				<div className="p-4 border border-white/10 rounded-lg bg-white/5 flex flex-col gap-2">
					<h3 className="font-semibold text-sm">{title}</h3>
					<div className="flex items-center gap-3">
						<button
							type="button"
							className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-xs"
						>
							Play Audio
						</button>
						<span className="text-xs opacity-60">Narrated History Stream</span>
					</div>
				</div>
			);

		case "3D_MODEL":
			return (
				<div className="p-4 border border-white/10 rounded-lg bg-white/5 flex flex-col gap-2">
					<h3 className="font-semibold text-sm">{title}</h3>
					<p className="text-xs opacity-65 font-medium text-amber-300">
						3D Scene Highlight Active
					</p>
				</div>
			);

		case "PDF":
			return (
				<div className="p-4 border border-white/10 rounded-lg bg-white/5 flex flex-col gap-2">
					<h3 className="font-semibold text-sm">{title}</h3>
					{contentUrl ? (
						<iframe
							src={contentUrl}
							title={title}
							className="w-full h-48 border border-white/10 rounded"
						/>
					) : (
						<p className="text-xs opacity-60">No PDF Document Link Provided</p>
					)}
				</div>
			);

		default:
			return (
				<div className="p-4 border border-red-500/20 rounded-lg bg-red-500/5 text-xs text-red-400">
					Unsupported Artifact Type
				</div>
			);
	}
}
