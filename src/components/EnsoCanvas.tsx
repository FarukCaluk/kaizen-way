import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Torus } from "@react-three/drei";
import * as THREE from "three";
import type { MouseParallax } from "@/types/kaizen";

/* ─── Inner scene — runs inside <Canvas> ────────────────────────────────── */
interface SceneProps {
  mouseRef: React.RefObject<MouseParallax>;
  focused: boolean;
}

function EnsoScene({ mouseRef, focused }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerTorusRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();

  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, [gl]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const mouse = mouseRef.current;

    const targetX = (mouse?.x ?? 0) * 0.18;
    const targetY = (mouse?.y ?? 0) * 0.12;

    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.04;
    groupRef.current.rotation.z = t * (focused ? 0.08 : 0.03);

    if (innerTorusRef.current) {
      innerTorusRef.current.rotation.x = t * 0.15;
      innerTorusRef.current.rotation.y = -t * 0.07;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Enso ring */}
      <Torus args={[2.2, 0.06, 8, 140]}>
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#B8961E"
          emissiveIntensity={focused ? 1.4 : 0.6}
          metalness={0.9}
          roughness={0.15}
        />
      </Torus>

      {/* Inner transmission torus — glass-like */}
      <Torus ref={innerTorusRef} args={[1.3, 0.18, 24, 100]}>
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.3}
          roughness={0.05}
          transmission={0.95}
          ior={1.5}
          chromaticAberration={0.04}
          color="#D4AF37"
          attenuationColor="#9A7D0A"
          attenuationDistance={0.8}
        />
      </Torus>

      {/* Subtle inner ink dot */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color="#BC002D"
          emissive="#BC002D"
          emissiveIntensity={3}
        />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={2.5} color="#D4AF37" />
      <pointLight position={[-4, -2, -3]} intensity={1.2} color="#BC002D" />
      <pointLight position={[0, 0, 5]} intensity={0.8} color="#f2f2f2" />
    </group>
  );
}

/* ─── Canvas wrapper ─────────────────────────────────────────────────────── */
interface EnsoCanvasProps {
  focused?: boolean;
  className?: string;
}

export default function EnsoCanvas({ focused = false, className = "" }: EnsoCanvasProps) {
  const mouseRef = useRef<MouseParallax>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none select-none ${className}`}
      style={{ filter: focused ? "drop-shadow(0 0 32px rgba(212,175,55,0.4))" : "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ background: "transparent" }}
      >
        <EnsoScene mouseRef={mouseRef} focused={focused} />
      </Canvas>
    </div>
  );
}
