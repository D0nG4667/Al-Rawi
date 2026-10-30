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
			<meshStandardMaterial color="#c5a880" roughness={0.8} metalness={0.2} />
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

	const dataArray = React.useMemo(() => {
		return audioAnalyser
			? new Uint8Array(audioAnalyser.frequencyBinCount)
			: null;
	}, [audioAnalyser]);

	useFrame((state, delta) => {
		// Smoothly interpolate camera toward active UIStore target coordinates
		const targetPos = new THREE.Vector3(
			cameraCoordinates[0],
			cameraCoordinates[1],
			cameraCoordinates[2],
		);
		state.camera.position.lerp(targetPos, 0.02);

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
						<SafeModel audioAnalyser={audioAnalyser} />
					</ErrorBoundary>

					{/* Cinematic Post-Processing Effects */}
					<EffectComposer>
						<Bloom
							luminanceThreshold={0.2}
							luminanceSmoothing={0.9}
							height={300}
							intensity={isAIThinking ? 2.2 : 1.2}
						/>
						<Noise opacity={0.015} />
						<Vignette eskil={false} offset={0.05} darkness={1.05} />
					</EffectComposer>

					<OrbitControls
						enableZoom={false}
						autoRotate
						autoRotateSpeed={isAIThinking ? 2.5 : 0.5}
					/>
				</Suspense>
			</Canvas>
		</div>
	);
}
