"use client";

import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Component, Suspense, type ReactNode } from "react";

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
	return <primitive object={gltf.scene} />;
}

export default function Scene() {
	return (
		<div className="fixed inset-0 -z-10 bg-[#0B0C10]">
			<Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
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
