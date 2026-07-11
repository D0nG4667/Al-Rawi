"use client";

import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Component, Suspense, type ReactNode } from "react";

// Filter out THREE.Clock deprecation warnings triggered by react-three-fiber under the hood
if (typeof window !== "undefined") {
	const originalWarn = console.warn;
	console.warn = (...args) => {
		if (
			args[0] &&
			typeof args[0] === "string" &&
			(args[0].includes("THREE.Clock") ||
				args[0].includes("THREE.Clock: This module has been deprecated"))
		) {
			return;
		}
		originalWarn(...args);
	};
}

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	override render() {
		if (this.state.hasError) {
			return this.props.fallback;
		}
		return this.props.children;
	}
}

function PlaceholderModel() {
	return (
		<mesh castShadow receiveShadow>
			<boxGeometry args={[2, 3, 2]} />
			<meshStandardMaterial color="#c5a880" roughness={0.8} metalness={0.2} />
		</mesh>
	);
}

function SafeModel() {
	const gltf = useGLTF("/models/diriyah_palace_draco.glb", "/decoders/draco/");
	if (!gltf?.scene) {
		return <PlaceholderModel />;
	}
	return <primitive object={gltf.scene} />;
}

export default function Scene() {
	const [contextLost, setContextLost] = React.useState(false);

	return (
		<div className="fixed inset-0 -z-10 bg-[#0B0C10]">
			{contextLost && (
				<div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
					<div className="glass-panel p-6 max-w-sm text-center flex flex-col gap-3">
						<h3 className="font-semibold text-lg text-amber-400">
							Graphics Context Reset
						</h3>
						<p className="text-sm opacity-80">
							Reloading 3D scene, please wait...
						</p>
					</div>
				</div>
			)}

			<Canvas
				camera={{ position: [0, 2, 8], fov: 45 }}
				onCreated={(state) => {
					const canvasEl = state.gl.domElement;
					canvasEl.addEventListener("webglcontextlost", (e) => {
						e.preventDefault();
						setContextLost(true);
					});
					canvasEl.addEventListener("webglcontextrestored", () => {
						setContextLost(false);
					});
				}}
			>
				<Suspense fallback={null}>
					<ambientLight intensity={0.4} />
					<directionalLight position={[5, 10, 5]} intensity={0.8} />
					<Environment preset="city" />

					{/* High-Poly Model */}
					<ErrorBoundary fallback={<PlaceholderModel />}>
						<SafeModel />
					</ErrorBoundary>

					<OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
				</Suspense>
			</Canvas>
		</div>
	);
}
