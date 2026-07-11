"use client";

import {
	Background,
	Controls,
	Handle,
	Position as HandlePosition,
	ReactFlow,
	useEdgesState,
	useNodesState,
	type Node,
	type Edge,
} from "@xyflow/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";

// Custom glowing glassmorphic Node Component
const CustomNode = ({ data }: { data: { label: string } }) => {
	return (
		<div className="px-4 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white backdrop-blur-md min-w-[140px] text-center shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:border-white/30 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all">
			<Handle
				type="target"
				position={HandlePosition.Top}
				style={{ visibility: "hidden" }}
			/>
			<div className="text-xs font-semibold tracking-wider uppercase">
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
	onClose: () => void;
}

export default function MindMap({ query, onClose }: MindMapProps) {
	const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let isMounted = true;

		async function fetchGraph() {
			try {
				const response = await fetch("/api/mindmap", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ query }),
				});

				if (!response.ok) {
					throw new Error("Failed to generate mind map graph");
				}

				const data = await response.json();

				if (isMounted) {
					// Map nodes to utilize custom node components
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
	}, [query, setNodes, setEdges]);

	return (
		<div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col pointer-events-auto text-white">
			{/* Panel Header */}
			<header className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40 backdrop-blur-sm z-10">
				<div>
					<h2 className="text-lg font-bold tracking-wider">
						Al-Rawi Knowledge Graph
					</h2>
					<p className="text-xs opacity-60 mt-0.5">
						Historical connections for: {query || "General Heritage Overview"}
					</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="p-2.5 rounded-full border border-white/10 hover:bg-white/10 active:scale-95 transition-all"
					aria-label="Close Mind Map"
				>
					<X className="w-4 h-4" />
				</button>
			</header>

			{/* Flow Canvas */}
			<div className="flex-1 min-h-0 relative">
				{loading && (
					<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 gap-3">
						<span className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
						<span className="text-xs tracking-wider opacity-60 uppercase font-medium">
							Synthesizing connections...
						</span>
					</div>
				)}

				{error && (
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
						<p className="text-sm text-red-400">{error}</p>
						<button
							type="button"
							onClick={onClose}
							className="text-xs px-4 py-2 border border-white/20 rounded-full hover:bg-white/10 transition-all font-medium"
						>
							Go Back
						</button>
					</div>
				)}

				{!loading && !error && (
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						nodeTypes={nodeTypes}
						fitView
						minZoom={0.5}
						maxZoom={1.5}
					>
						<Background
							color="#ffffff"
							gap={20}
							size={1}
							className="opacity-5"
						/>
						<Controls className="!bg-black/80 !border-white/15 !rounded-xl !p-1 !shadow-lg [&>button]:!border-white/10 [&>button]:!fill-white [&>button]:hover:!bg-white/10" />
					</ReactFlow>
				)}
			</div>
		</div>
	);
}
