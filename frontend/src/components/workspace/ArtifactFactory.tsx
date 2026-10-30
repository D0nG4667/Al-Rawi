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
}: ArtifactProps): React.ReactElement {
	switch (type) {
		case "MINDMAP":
			return (
				<div className="p-4 manuscript-card flex flex-col gap-2">
					<h3 className="font-display font-semibold text-sm">{title}</h3>
					<p className="text-xs text-[var(--text-secondary)]">
						Historical Mind Map View
					</p>
					{contentUrl && (
						<a
							href={contentUrl}
							className="text-xs text-[var(--accent-gold)] hover:underline font-medium"
						>
							View Data Source
						</a>
					)}
				</div>
			);

		case "AUDIO":
			return (
				<div className="p-4 manuscript-card flex flex-col gap-2">
					<h3 className="font-display font-semibold text-sm">{title}</h3>
					<div className="flex items-center gap-3">
						<button
							type="button"
							className="px-3 py-1.5 heritage-chip rounded-full text-xs font-semibold cursor-pointer"
						>
							Play Audio
						</button>
						<span className="text-xs text-[var(--text-secondary)]">
							Narrated History Stream
						</span>
					</div>
				</div>
			);

		case "3D_MODEL":
			return (
				<div className="p-4 manuscript-card flex flex-col gap-2">
					<h3 className="font-display font-semibold text-sm">{title}</h3>
					<p className="text-xs font-medium text-[var(--accent-gold)]">
						3D Scene Highlight Active
					</p>
				</div>
			);

		case "PDF":
			return (
				<div className="p-4 manuscript-card flex flex-col gap-2">
					<h3 className="font-display font-semibold text-sm">{title}</h3>
					{contentUrl ? (
						<iframe
							src={contentUrl}
							title={title}
							className="w-full h-48 border border-[var(--border-subtle)] rounded-lg"
						/>
					) : (
						<p className="text-xs text-[var(--text-secondary)]">
							No PDF Document Link Provided
						</p>
					)}
				</div>
			);

		default:
			return (
				<div className="p-4 border border-[var(--accent-terracotta)]/30 rounded-xl bg-[var(--accent-terracotta-soft)] text-xs text-[var(--accent-terracotta)]">
					Unsupported Artifact Type
				</div>
			);
	}
}
