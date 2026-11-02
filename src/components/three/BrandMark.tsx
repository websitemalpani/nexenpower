"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";

// The NEXEN "X" in 3D: a solar-panel strip crossed by a turning wind blade.

function useStripTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 128, 512);
    g.addColorStop(0, "#058a52");
    g.addColorStop(1, "#024a2d");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 512);
    ctx.strokeStyle = "rgba(238,243,236,.9)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(64, 0);
    ctx.lineTo(64, 512);
    for (let i = 1; i < 4; i++) {
      ctx.moveTo(0, (i * 512) / 4);
      ctx.lineTo(128, (i * 512) / 4);
    }
    ctx.stroke();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

function useBladeGeometry() {
  return useMemo(() => {
    // Two tapered blades meeting at a narrow waist, like the logo.
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.16, 0.25);
    s.lineTo(0.05, 2.3);
    s.lineTo(-0.02, 2.3);
    s.lineTo(-0.1, 0.3);
    s.lineTo(0, 0);
    const blade = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 });
    const other = blade.clone().rotateZ(Math.PI);
    const merged = new THREE.BufferGeometry();
    const parts = [blade, other];
    const count = parts.reduce((n, p) => n + p.attributes.position.count, 0);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const a = new THREE.Color("#00abb2");
    const b = new THREE.Color("#0aa36a");
    const tmp = new THREE.Color();
    let o = 0;
    parts.forEach((p, idx) => {
      const arr = p.attributes.position.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        pos.set([arr[i], arr[i + 1], arr[i + 2]], o);
        const t = Math.min(1, Math.abs(arr[i + 1]) / 2.3);
        tmp.copy(idx === 0 ? a : b).lerp(idx === 0 ? b : a, t * 0.6);
        col.set([tmp.r, tmp.g, tmp.b], o);
        o += 3;
      }
    });
    merged.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    merged.setAttribute("color", new THREE.BufferAttribute(col, 3));
    merged.computeVertexNormals();
    merged.translate(0, 0, 0.12);
    return merged;
  }, []);
}

function Mark({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const rotor = useRef<THREE.Mesh>(null);
  const strip = useStripTexture();
  const blade = useBladeGeometry();

  useFrame(({ pointer, clock }, dt) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.x * 0.5, 3, dt);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -pointer.y * 0.3, 3, dt);
    // Sway around the logo pose so the "X" always stays readable.
    if (rotor.current && !reduced) rotor.current.rotation.z = 0.62 + Math.sin(clock.elapsedTime * 0.6) * 0.35;
  });

  return (
    <group ref={group}>
      <mesh rotation-z={-0.6}>
        <boxGeometry args={[0.85, 4.6, 0.12]} />
        <meshPhysicalMaterial map={strip} roughness={0.3} metalness={0.2} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
      <mesh ref={rotor} geometry={blade} rotation-z={0.62}>
        <meshPhysicalMaterial vertexColors roughness={0.25} metalness={0.3} clearcoat={1} />
      </mesh>
      <mesh position-z={0.16}>
        <cylinderGeometry args={[0.12, 0.12, 0.12, 24]} />
        <meshStandardMaterial color="#e9f2ee" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function BrandMark() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 8.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={2.5} color="#5fe3c8" position={[-4, 2, 4]} scale={[4, 8, 1]} />
          <Lightformer form="rect" intensity={2} color="#ffd59a" position={[4, -1, 3]} scale={[3, 6, 1]} />
          <Lightformer form="ring" intensity={1.5} color="#ffffff" position={[0, 5, 2]} scale={3} />
        </Environment>
        <Float speed={reduced ? 0 : 1.4} rotationIntensity={0.25} floatIntensity={0.6}>
          <Mark reduced={reduced} />
        </Float>
      </Canvas>
    </div>
  );
}
