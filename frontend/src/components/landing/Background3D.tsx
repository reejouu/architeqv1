// @ts-nocheck
"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Bot() {
    const group = useRef<THREE.Group>();
    const head = useRef<THREE.Group>();
    const body = useRef<THREE.Mesh>();

    // Smooth scroll lerping
    const targetRotation = useRef(0);

    useFrame((state, delta) => {
        if (!group.current) return;

        // Calculate scroll progress (0 to 1 based on page height)
        const scrollY = window.scrollY;
        // const maxScroll = document.body.scrollHeight - window.innerHeight;
        // const progress = scrollY / maxScroll;

        // Rotate bot based on scroll
        targetRotation.current = scrollY * 0.005;

        // Smooth lerp for rotation
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotation.current, 0.1);

        // Bobbing animation with time
        const t = state.clock.getElapsedTime();
        group.current.position.y = Math.sin(t * 1.5) * 0.1;

        // Head follow mouse slightly
        if (head.current) {
            const mouseX = state.pointer.x * 0.5;
            const mouseY = state.pointer.y * 0.5;
            head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, mouseX, 0.1);
            head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -mouseY, 0.1);
        }
    });

    return (
        <group ref={group} dispose={null}>
            {/* HEAD GROUP */}
            <group ref={head} position={[0, 1.4, 0]}>
                {/* Face/Screen */}
                <mesh position={[0, 0, 0.35]}>
                    <boxGeometry args={[0.5, 0.3, 0.1]} />
                    <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.8} />
                </mesh>
                {/* Eyes (Glowing) */}
                <mesh position={[-0.12, 0, 0.41]}>
                    <planeGeometry args={[0.08, 0.08]} />
                    <meshBasicMaterial color="#00ff88" />
                </mesh>
                <mesh position={[0.12, 0, 0.41]}>
                    <planeGeometry args={[0.08, 0.08]} />
                    <meshBasicMaterial color="#00ff88" />
                </mesh>

                {/* Helmet/Head Shape */}
                <mesh>
                    <boxGeometry args={[0.6, 0.5, 0.6]} />
                    <meshStandardMaterial color="#e0e0e0" roughness={0.3} metalness={0.5} />
                </mesh>

                {/* Antenna */}
                <mesh position={[0, 0.35, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                    <meshStandardMaterial color="#888" />
                </mesh>
                <mesh position={[0, 0.5, 0]}>
                    <sphereGeometry args={[0.05]} />
                    <meshStandardMaterial color="#ff0055" />
                </mesh>
            </group>

            {/* BODY */}
            <mesh ref={body} position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.3, 0.2, 1, 32]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.6} />
            </mesh>

            {/* ARMS */}
            <mesh position={[-0.45, 0.6, 0]}>
                <capsuleGeometry args={[0.1, 0.6]} />
                <meshStandardMaterial color="#ccc" />
            </mesh>
            <mesh position={[0.45, 0.6, 0]}>
                <capsuleGeometry args={[0.1, 0.6]} />
                <meshStandardMaterial color="#ccc" />
            </mesh>

        </group>
    );
}

export default function Background3D() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} />

                <Environment preset="city" />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Bot />
                </Float>

                <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
            </Canvas>
        </div>
    );
}
