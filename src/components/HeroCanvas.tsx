'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const { viewport } = useThree();

  const [positions, grid] = useMemo(() => {
    const cols = 28;
    const rows = 18;
    const pos = new Float32Array(cols * rows * 3);
    const gridData = { cols, rows, spacingX: 0.38, spacingY: 0.38 };
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        pos[i++] = (c - cols / 2) * gridData.spacingX;
        pos[i++] = (r - rows / 2) * gridData.spacingY;
        pos[i++] = 0;
      }
    }
    return [pos, gridData];
  }, []);

  const clock = useRef(0);

  useFrame((state, delta) => {
    clock.current += delta;
    const t = clock.current;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const cols = grid.cols;
    const rows = grid.rows;
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const baseX = (c - cols / 2) * grid.spacingX;
        const baseY = (r - rows / 2) * grid.spacingY;
        const wave = Math.sin(c * 0.4 + t * 0.8) * Math.cos(r * 0.35 + t * 0.6) * 0.12;
        pos[i++] = baseX;
        pos[i++] = baseY + wave;
        pos[i++] = 0;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.z = Math.sin(t * 0.12) * 0.04;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#0A0A0A"
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  );
}

function WireframeSphere() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.12;
    ref.current.rotation.y = t * 0.18;
    ref.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.018);
  });

  return (
    <mesh ref={ref} position={[2.2, 0, 0]}>
      <torusKnotGeometry args={[0.9, 0.28, 160, 12]} />
      <meshBasicMaterial color="#0A0A0A" wireframe opacity={0.12} transparent />
    </mesh>
  );
}

export function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 55 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ParticleField />
      <WireframeSphere />
    </Canvas>
  );
}
