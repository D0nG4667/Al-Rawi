"use client";

import {
	Background,
	Controls,
	type Edge,
	Handle,
	Position as HandlePosition,
	type Node,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import { Compass, X } from "lucide-react";
import { type MouseEvent, useEffect, useState } from "react";
import HeritageOrnament from "@/components/ui/HeritageOrnament";
import { useUIStore } from "@/store/useUIStore";
import "@xyflow/react/dist/style.css";

// Custom manuscript-styled Knowledge Graph Node Component
const CustomNode = ({ data }: { data: { label: string } }) => {
	return (
		<div className="px-4 py-3 rounded-xl manuscript-card border border-[var(--border-strong)] text-[var(--text-primary)] backdrop-blur-md min-w-[156px] text-center shadow-lg hover:scale-105 transition-all cursor-pointer">
			<Handle
				type="target"
				position={HandlePosition.Top}
				style={{ visibility: "hidden" }}
			/>
			<div className="flex items-center justify-center gap-1.5 mb-1">
				<HeritageOrnament variant="corner-rosette" className="w-3 h-3" />
				<span className="text-[10px] font-mono-tabular uppercase tracking-widest text-[var(--accent-gold)]">
					Heritage Node
				</span>
			</div>
			<div className="text-xs font-display font-semibold tracking-wide">
				{data.label}
			</div>
			<Handle
				type="source"
				position={HandlePosition.Bottom}
				style={{ visibility: "hidden" }}
			/>
		</div>
	);
};

const nodeTypes = {
	custom: CustomNode,
};

interface MindMapProps {
	query?: string;
	apiKey?: string;
	onClose: () => void;
}

export default function MindMap({
	query,
	apiKey,
	onClose,
}: MindMapProps): React.ReactElement {
	const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const setFocusNode = useUIStore((state) => state.setFocusNode);
	const theme = useUIStore((state) => state.theme);

	useEffect(() => {
		let isMounted = true;

		async function fetchGraph(): Promise<void> {
			try {
				const payload: { query?: string; api_key?: string } = { query };
				if (apiKey?.trim()) {
					payload.api_key = apiKey.trim();
				}

				const response = await fetch("/api/mindmap", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				});

				if (!response.ok) {
					throw new Error("Failed to generate mind map graph");
				}

				const data = await response.json();

				if (isMounted) {
					const mappedNodes = (data.nodes || []).map((node: Node) => ({
						...node,
						type: "custom",
					}));

					setNodes(mappedNodes);
					setEdges(data.edges || []);
					setLoading(false);
				}
			} catch (err: unknown) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to load mind map";
				if (isMounted) {
					setError(errorMessage);
					setLoading(false);
				}
			}
		}

		fetchGraph();

		return () => {
			isMounted = false;
		};
	}, [query, apiKey, setNodes, setEdges]);

	const handleNodeClick = (_event: MouseEvent, node: Node): void => {
		const label =
			typeof node.data?.label === "string" ? node.data.label : node.id;
		setFocusNode(label, [0, 1.8, 6]);
	};

	const gridColor = theme === "sandstone" ? "#8a7460" : "#d9a441";

	return (
		<div className="fixed inset-0 z-50 bg-[var(--bg-canvas)]/90 backdrop-blur-xl flex flex-col pointer-events-auto text-[var(--text-primary)]">
			<HeritageOrnament variant="najdi-band" />

			{/* Panel Header */}
			<header className="flex justify-between items-center px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] z-10">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-xl heritage-chip">
						<Compass className="w-5 h-5" />
					</div>
					<div>
						<h2 className="text-lg font-display font-bold tracking-wide">
							Al-Rawi Knowledge Cartography
						</h2>
						<p className="text-xs text-[var(--text-secondary)] mt-0.5">
							Semantic relationships for:{" "}
							<span className="text-[var(--accent-gold)] font-medium">
								{query || "General Saudi UNESCO Heritage"}
							</span>
						</p>
					</div>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="p-2.5 rounded-full border border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)] active:scale-95 transition-all cursor-pointer"
					aria-label="Close Mind Map"
				>
					<X className="w-4 h-4" />
				</button>
			</header>

			{/* Flow Canvas */}
			<div className="flex-1 min-h-0 relative">
				{loading && (
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
						<span className="w-9 h-9 rounded-full border-2 border-[var(--border-subtle)] border-t-[var(--accent-gold)] animate-spin" />
						<span className="text-xs tracking-widest text-[var(--text-secondary)] uppercase font-mono-tabular">
							Synthesizing Archival Graph...
						</span>
					</div>
				)}

				{error && (
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
						<p className="text-sm text-[var(--accent-terracotta)] font-medium">
							{error}
						</p>
						<button
							type="button"
							onClick={onClose}
							className="text-xs px-5 py-2.5 heritage-chip rounded-full font-semibold cursor-pointer"
						>
							Return to Workspace
						</button>
					</div>
				)}

				{!loading && !error && (
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onNodeClick={handleNodeClick}
						nodeTypes={nodeTypes}
						fitView
						minZoom={0.5}
						maxZoom={1.5}
					>
						<Background
							color={gridColor}
							gap={24}
							size={1.2}
							className="opacity-20"
						/>
						<Controls className="!bg-[var(--bg-elevated)] !border-[var(--border-subtle)] !rounded-xl !p-1 !shadow-lg [&>button]:!border-[var(--border-subtle)] [&>button]:!fill-[var(--text-primary)] [&>button]:!bg-transparent [&>button]:hover:!bg-[var(--accent-gold-soft)]" />
					</ReactFlow>
				)}
			</div>
		</div>
	);
}
