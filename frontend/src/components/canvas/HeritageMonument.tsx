"use client";

import { useFrame } from "@react-three/fiber";
import type React from "react";
import { useMemo, useRef } from "react";
import type * as THREE from "three";
import { type HeritageSiteId, useUIStore } from "@/store/useUIStore";

interface HeritageMonumentProps {
	siteId: HeritageSiteId;
	isThinking: boolean;
}

/**
 * Procedural 3D architectural silhouettes representing Saudi Arabia's three
 * flagship UNESCO World Heritage typologies, encircled by a rotating brass
 * astrolabe gimbal and drifting desert dust motes.
 */
export default function HeritageMonument({
	siteId,
	isThinking,
}: HeritageMonumentProps): React.ReactElement {
	const ringOuterRef = useRef<THREE.Mesh>(null);
	const ringInnerRef = useRef<THREE.Mesh>(null);
	const dustRef = useRef<THREE.Points>(null);
	const theme = useUIStore((state) => state.theme);

	const isSandstone = theme === "sandstone";
	const adobeColor = isSandstone ? "#c89f70" : "#b88a58";
	const sandstoneColor = isSandstone ? "#d28b5c" : "#c8673e";
	const coralStoneColor = isSandstone ? "#dfd3c3" : "#d5c7b4";
	const teakWoodColor = "#6e472b";
	const brassColor = isSandstone ? "#a86a1f" : "#d9a441";

	// Deterministic 3D desert dust particle field
	const dustPositions = useMemo(() => {
		const count = 160;
		const positions = new Float32Array(count * 3);
		for (let i = 0; i < count; i++) {
			const angle = i * 2.39996;
			const radius = 2.2 + ((i * 17) % 45) * 0.1;
			const y = -1.2 + ((i * 31) % 50) * 0.09;
			positions[i * 3] = Math.cos(angle) * radius;
			positions[i * 3 + 1] = y;
			positions[i * 3 + 2] = Math.sin(angle) * radius;
		}
		return positions;
	}, []);

	useFrame((_state, delta) => {
		const speedMultiplier = isThinking ? 3.2 : 1;
		if (ringOuterRef.current) {
			ringOuterRef.current.rotation.z += delta * 0.22 * speedMultiplier;
			ringOuterRef.current.rotation.x += delta * 0.08 * speedMultiplier;
		}
		if (ringInnerRef.current) {
			ringInnerRef.current.rotation.y -= delta * 0.35 * speedMultiplier;
		}
		if (dustRef.current) {
			dustRef.current.rotation.y += delta * 0.05 * speedMultiplier;
		}
	});

	return (
		<group position={[0, -0.4, 0]}>
			{/* Terraced Plinth Base */}
			<mesh position={[0, -1.35, 0]} receiveShadow>
				<cylinderGeometry args={[3.1, 3.45, 0.28, 32]} />
				<meshStandardMaterial
					color={adobeColor}
					roughness={0.85}
					metalness={0.1}
				/>
			</mesh>
			<mesh position={[0, -1.18, 0]} receiveShadow>
				<cylinderGeometry args={[2.5, 2.7, 0.08, 32]} />
				<meshStandardMaterial
					color={brassColor}
					roughness={0.35}
					metalness={0.8}
				/>
			</mesh>

			{/* Site 1: At-Turaif · Najdi Mud-Brick Citadel (Salwa Keep & Shurfat) */}
			{siteId === "diriyah" && (
				<group>
					{/* Central Salwa Keep */}
					<mesh position={[0, 0.35, 0]} castShadow receiveShadow>
						<boxGeometry args={[2.1, 3.1, 1.9]} />
						<meshStandardMaterial color={adobeColor} roughness={0.82} />
					</mesh>
					{/* Flanking Tapered Bastions */}
					<mesh position={[-1.45, 0.05, 0.35]} castShadow receiveShadow>
						<cylinderGeometry args={[0.52, 0.72, 2.5, 4]} />
						<meshStandardMaterial color={adobeColor} roughness={0.85} />
					</mesh>
					<mesh position={[1.45, 0.05, 0.35]} castShadow receiveShadow>
						<cylinderGeometry args={[0.52, 0.72, 2.5, 4]} />
						<meshStandardMaterial color={adobeColor} roughness={0.85} />
					</mesh>
					{/* Gypsum Band & Stepped Shurfat Crenellations */}
					<mesh position={[0, 1.95, 0]}>
						<boxGeometry args={[2.16, 0.14, 1.96]} />
						<meshStandardMaterial color="#f5efe6" roughness={0.6} />
					</mesh>
					{[-0.8, -0.4, 0, 0.4, 0.8].map((xPos) => (
						<mesh key={`cren-${xPos}`} position={[xPos, 2.12, 0.92]}>
							<coneGeometry args={[0.14, 0.28, 4]} />
							<meshStandardMaterial color="#f5efe6" roughness={0.65} />
						</mesh>
					))}
				</group>
			)}

			{/* Site 2: Al-Hijr · Hegra (Qasr al-Farid Rock-Cut Nabataean Facade) */}
			{siteId === "hegra" && (
				<group>
					{/* Raw Desert Sandstone Monolith */}
					<mesh position={[0, 0.5, -0.35]} castShadow receiveShadow>
						<dodecahedronGeometry args={[2.15, 1]} />
						<meshStandardMaterial color={sandstoneColor} roughness={0.88} />
					</mesh>
					{/* Carved Flat Tomb Facade */}
					<mesh position={[0, 0.35, 0.78]} castShadow receiveShadow>
						<boxGeometry args={[2.2, 2.9, 0.45]} />
						<meshStandardMaterial color={sandstoneColor} roughness={0.72} />
					</mesh>
					{/* Four Nabataean Pilasters */}
					{[-0.92, -0.35, 0.35, 0.92].map((xPos) => (
						<mesh key={`pilaster-${xPos}`} position={[xPos, 0.1, 1.04]}>
							<boxGeometry args={[0.14, 2.1, 0.12]} />
							<meshStandardMaterial color={adobeColor} roughness={0.65} />
						</mesh>
					))}
					{/* Classical Entablature & Opposing Crowstep Crest */}
					<mesh position={[0, 1.35, 1.06]}>
						<boxGeometry args={[2.3, 0.24, 0.18]} />
						<meshStandardMaterial color={adobeColor} roughness={0.65} />
					</mesh>
					<mesh position={[-0.6, 1.95, 1.02]}>
						<boxGeometry args={[0.9, 0.45, 0.16]} />
						<meshStandardMaterial color={sandstoneColor} roughness={0.7} />
					</mesh>
					<mesh position={[0.6, 1.95, 1.02]}>
						<boxGeometry args={[0.9, 0.45, 0.16]} />
						<meshStandardMaterial color={sandstoneColor} roughness={0.7} />
					</mesh>
				</group>
			)}

			{/* Site 3: Al-Balad · Historic Jeddah (Manqabi Coral Tower & Rawashin) */}
			{siteId === "jeddah" && (
				<group>
					{/* Multi-Story Coral-Stone Tower House */}
					<mesh position={[0, 0.55, 0]} castShadow receiveShadow>
						<boxGeometry args={[1.85, 3.5, 1.75]} />
						<meshStandardMaterial color={coralStoneColor} roughness={0.78} />
					</mesh>
					{/* Horizontal Taklil Java Teak Tie-Beams */}
					{[-0.4, 0.4, 1.2, 1.9].map((yPos) => (
						<mesh key={`taklil-${yPos}`} position={[0, yPos, 0]}>
							<boxGeometry args={[1.9, 0.08, 1.8]} />
							<meshStandardMaterial color={teakWoodColor} roughness={0.65} />
						</mesh>
					))}
					{/* Cantilevered Teakwood Rawashin Mashrabiya Bays */}
					{[-0.05, 0.85, 1.65].map((yPos) => (
						<mesh key={`roshan-${yPos}`} position={[0, yPos, 0.98]} castShadow>
							<boxGeometry args={[1.25, 0.62, 0.32]} />
							<meshStandardMaterial color={teakWoodColor} roughness={0.55} />
						</mesh>
					))}
				</group>
			)}

			{/* Celestial Astrolabe Brass Gimbal Rings */}
			<mesh ref={ringOuterRef} position={[0, 0.6, 0]} rotation={[0.4, 0.2, 0]}>
				<torusGeometry args={[2.95, 0.022, 16, 96]} />
				<meshStandardMaterial
					color={brassColor}
					roughness={0.25}
					metalness={0.9}
				/>
			</mesh>
			<mesh
				ref={ringInnerRef}
				position={[0, 0.6, 0]}
				rotation={[1.1, -0.3, 0.4]}
			>
				<torusGeometry args={[2.45, 0.016, 16, 80]} />
				<meshStandardMaterial
					color={brassColor}
					roughness={0.3}
					metalness={0.85}
				/>
			</mesh>

			{/* Floating Golden Desert Dust Particles */}
			<points ref={dustRef}>
				<bufferGeometry>
					<bufferAttribute
						attach="attributes-position"
						args={[dustPositions, 3]}
					/>
				</bufferGeometry>
				<pointsMaterial
					color={brassColor}
					size={0.045}
					transparent
					opacity={isSandstone ? 0.45 : 0.65}
				/>
			</points>
		</group>
	);
}
