"use client";

import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
	Bloom,
	EffectComposer,
	Noise,
	Vignette,
} from "@react-three/postprocessing";
import React, { Component, type ReactNode, Suspense } from "react";
import * as THREE from "three";
import { useUIStore } from "@/store/useUIStore";

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

	override render(): ReactNode {
		if (this.state.hasError) {
			return this.props.fallback;
		}
		return this.props.children;
	}
}

function PlaceholderModel(): React.ReactElement {
	return (
		<mesh castShadow receiveShadow>
			<boxGeometry args={[2, 3, 2]} />
			<meshStandardMaterial color="#c89d66" roughness={0.75} metalness={0.25} />
		</mesh>
	);
}

function SafeModel({
	audioAnalyser,
}: {
	audioAnalyser: AnalyserNode | null;
}): React.ReactElement {
	const gltf = useGLTF("/models/diriyah_palace_draco.glb", "/decoders/draco/");
	const groupRef = React.useRef<THREE.Group>(null);
	const isAIThinking = useUIStore((state) => state.isAIThinking);
	const cameraCoordinates = useUIStore((state) => state.cameraCoordinates);
	const activeDrawer = useUIStore((state) => state.activeDrawer);

	const dataArray = React.useMemo(() => {
		return audioAnalyser
			? new Uint8Array(audioAnalyser.frequencyBinCount)
			: null;
	}, [audioAnalyser]);

	useFrame((state, delta) => {
		// Offset horizontal camera framing slightly when a slide-over sheet is open
		const drawerOffset =
			activeDrawer === "oracle" ? -1.1 : activeDrawer === "archive" ? 1.1 : 0;

		const targetPos = new THREE.Vector3(
			cameraCoordinates[0] + drawerOffset,
			cameraCoordinates[1],
			cameraCoordinates[2],
		);
		state.camera.position.lerp(targetPos, 0.03);

		if (groupRef.current && isAIThinking) {
			groupRef.current.rotation.y += delta * 1.8;
		}

		if (audioAnalyser && dataArray && groupRef.current) {
			audioAnalyser.getByteFrequencyData(dataArray);
			const average =
				dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
			// Scale the palace scene object between 1.0x and 1.15x based on frequency volume peaks
			const scale = 1 + (average / 255) * 0.15;
			groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.15);
		} else if (groupRef.current) {
			// Return to baseline scale smoothly
			groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.15);
		}
	});

	if (!gltf?.scene) {
		return <PlaceholderModel />;
	}
	return (
		<group ref={groupRef}>
			<primitive object={gltf.scene} />
		</group>
	);
}

interface SceneProps {
	audioAnalyser: AnalyserNode | null;
}

export default function Scene({
	audioAnalyser,
}: SceneProps): React.ReactElement {
	const [contextLost, setContextLost] = React.useState(false);
	const isAIThinking = useUIStore((state) => state.isAIThinking);
	const theme = useUIStore((state) => state.theme);

	const isSandstone = theme === "sandstone";
	const fogColor = isSandstone ? "#f4eadb" : "#0e1020";
	const keyLightColor = isSandstone ? "#fff1d6" : "#f5cfa0";
	const rimLightColor = isSandstone ? "#d9a441" : "#c8673e";

	return (
		<div className="fixed inset-0 -z-10 bg-[var(--bg-canvas)] transition-colors duration-500">
			{contextLost && (
				<div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
					<div className="glass-panel p-6 max-w-sm text-center flex flex-col gap-3">
						<h3 className="font-display font-semibold text-lg text-[var(--accent-gold)]">
							Graphics Context Reset
						</h3>
						<p className="text-sm text-[var(--text-secondary)]">
							Reloading 3D architectural scene, please wait...
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
				<color attach="background" args={[fogColor]} />
				<fog attach="fog" args={[fogColor, 10, 26]} />
				<Suspense fallback={null}>
					<ambientLight intensity={isSandstone ? 0.75 : 0.42} />
					<directionalLight
						position={[5, 10, 5]}
						intensity={isSandstone ? 1.15 : 0.85}
						color={keyLightColor}
					/>
					<pointLight
						position={[-6, 3, -4]}
						intensity={isSandstone ? 0.45 : 0.65}
						color={rimLightColor}
					/>
					<Environment preset={isSandstone ? "sunset" : "city"} />

					{/* High-Poly Model */}
					<ErrorBoundary fallback={<PlaceholderModel />}>
						<SafeModel audioAnalyser={audioAnalyser} />
					</ErrorBoundary>

					{/* Cinematic Post-Processing Effects */}
					<EffectComposer>
						<Bloom
							luminanceThreshold={isSandstone ? 0.45 : 0.22}
							luminanceSmoothing={0.9}
							height={300}
							intensity={
								isAIThinking
									? isSandstone
										? 1.4
										: 2.2
									: isSandstone
										? 0.65
										: 1.15
							}
						/>
						<Noise opacity={0.015} />
						<Vignette
							eskil={false}
							offset={0.05}
							darkness={isSandstone ? 0.55 : 1.0}
						/>
					</EffectComposer>

					<OrbitControls
						enableZoom={false}
						autoRotate
						autoRotateSpeed={isAIThinking ? 2.5 : 0.45}
					/>
				</Suspense>
			</Canvas>
		</div>
	);
}
