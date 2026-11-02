"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, AdaptiveDpr } from "@react-three/drei";
import { heroState, terrainHeight } from "./heroState";

const SUN_DIR = new THREE.Vector3(0.1, 0.06, -1).normalize();
const FOG = "#2f4c45";

/* ---------------------------------- Sky ---------------------------------- */

function Sky() {
  const ref = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: new THREE.Color("#020d0a") },
          uMid: { value: new THREE.Color("#0d4440") },
          uHorizon: { value: new THREE.Color("#f0a25a") },
          uSun: { value: new THREE.Color("#ffb45e") },
          uSunDir: { value: SUN_DIR },
        },
        vertexShader: /* glsl */ `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uTop, uMid, uHorizon, uSun, uSunDir;
          varying vec3 vPos;
          void main() {
            vec3 d = normalize(vPos);
            float h = d.y;
            vec3 col = mix(uHorizon, uMid, smoothstep(-0.01, 0.16, h));
            col = mix(col, uTop, smoothstep(0.14, 0.55, h));
            float s = max(dot(d, uSunDir), 0.0);
            col += uSun * pow(s, 6.0) * 0.45;
            col += uSun * pow(s, 60.0) * 0.9;
            col += vec3(1.0, 0.92, 0.78) * smoothstep(0.99955, 0.9997, s) * 1.6;
            col = mix(col, uMid * 0.35, smoothstep(0.0, -0.12, h));
            gl_FragColor = vec4(col, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`,
      }),
    [],
  );
  // Keep the dome centred on the camera so it reads as infinitely far.
  useFrame(({ camera }) => ref.current?.position.copy(camera.position));
  return (
    <mesh ref={ref} material={material} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[400, 32, 16]} />
    </mesh>
  );
}

/* -------------------------------- Terrain -------------------------------- */

function Terrain() {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(320, 200, 160, 100);
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0, -70);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const low = new THREE.Color("#0a2017");
    const mid = new THREE.Color("#18361f");
    const high = new THREE.Color("#3a3a24");
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = terrainHeight(x, z);
      pos.setY(i, y);
      const n = 0.5 + 0.5 * Math.sin(x * 0.31 + Math.cos(z * 0.27) * 2.1);
      c.copy(low).lerp(mid, Math.min(1, y / 6) * 0.8 + n * 0.2).lerp(high, Math.max(0, (y - 8) / 20));
      colors.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow={false}>
      <meshStandardMaterial vertexColors roughness={0.95} metalness={0} flatShading />
    </mesh>
  );
}

/* ------------------------------ Solar field ------------------------------ */

function usePanelTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 160;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 256, 160);
    grad.addColorStop(0, "#14365a");
    grad.addColorStop(1, "#0a1d33");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 160);
    ctx.strokeStyle = "rgba(140,190,220,0.45)";
    ctx.lineWidth = 2;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo((i * 256) / 6, 0);
      ctx.lineTo((i * 256) / 6, 160);
      ctx.stroke();
    }
    for (let j = 1; j < 4; j++) {
      ctx.beginPath();
      ctx.moveTo(0, (j * 160) / 4);
      ctx.lineTo(256, (j * 160) / 4);
      ctx.stroke();
    }
    ctx.strokeStyle = "#b9c4c8";
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, 256, 160);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
}

function SolarField({ lite }: { lite: boolean }) {
  const panels = useRef<THREE.InstancedMesh>(null);
  const posts = useRef<THREE.InstancedMesh>(null);
  const texture = usePanelTexture();

  const layout = useMemo(() => {
    const items: [number, number, number][] = [];
    const span = lite ? 16 : 30;
    for (let z = 9; z >= -12; z -= 2.6) {
      for (let x = -span; x <= span; x += 1.8) {
        if (Math.abs(x) < 2.4) continue; // service road the camera glides along
        items.push([x, terrainHeight(x, z), z]);
      }
    }
    return items;
  }, [lite]);

  useEffect(() => {
    const m = new THREE.Object3D();
    layout.forEach(([x, y, z], i) => {
      m.position.set(x, y + 0.95, z);
      m.rotation.set(0.42, 0, 0);
      m.updateMatrix();
      panels.current!.setMatrixAt(i, m.matrix);
      m.position.set(x, y + 0.45, z);
      m.rotation.set(0, 0, 0);
      m.updateMatrix();
      posts.current!.setMatrixAt(i, m.matrix);
    });
    panels.current!.instanceMatrix.needsUpdate = true;
    posts.current!.instanceMatrix.needsUpdate = true;
  }, [layout]);

  return (
    <group>
      <instancedMesh ref={panels} args={[undefined, undefined, layout.length]} frustumCulled={false}>
        <boxGeometry args={[1.7, 0.04, 1.05]} />
        <meshStandardMaterial map={texture} metalness={0.75} roughness={0.22} envMapIntensity={1.4} />
      </instancedMesh>
      <instancedMesh ref={posts} args={[undefined, undefined, layout.length]} frustumCulled={false}>
        <boxGeometry args={[0.06, 0.9, 0.06]} />
        <meshStandardMaterial color="#6b7671" roughness={0.6} metalness={0.4} />
      </instancedMesh>
    </group>
  );
}

/* -------------------------------- Turbines ------------------------------- */

const TURBINES: [number, number, number][] = [
  [-17, -28, 1],
  [-6, -38, 1.05],
  [7, -31, 1],
  [18, -44, 1.15],
  [31, -30, 1],
  [-31, -46, 1.1],
  [-47, -62, 1.3],
  [45, -60, 1.3],
  [-1, -66, 1.35],
  [-22, -82, 1.45],
  [26, -86, 1.5],
  [60, -78, 1.4],
  [-64, -84, 1.5],
];

function useBladeGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0.42, 0.7, 0.3, 3.6, 0.04, 5.4);
    s.lineTo(-0.04, 5.4);
    s.bezierCurveTo(-0.12, 3.2, -0.22, 0.7, 0, 0);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: false, curveSegments: 10 });
    g.translate(0, 0.25, -0.03);
    return g;
  }, []);
}

function Turbine({ position, scale, speed, phase, blade, reduced }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
  blade: THREE.BufferGeometry;
  reduced: boolean;
}) {
  const rotor = useRef<THREE.Group>(null);
  const beacon = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, dt) => {
    if (rotor.current && !reduced) rotor.current.rotation.z -= dt * speed;
    if (beacon.current) beacon.current.visible = Math.sin(clock.elapsedTime * 2.2 + phase) > 0.6;
  });
  return (
    <group position={position} scale={scale} rotation-y={phase * 0.12 - 0.1}>
      <mesh position-y={5}>
        <cylinderGeometry args={[0.1, 0.24, 10, 12]} />
        <meshStandardMaterial color="#d9e2dc" roughness={0.55} />
      </mesh>
      <mesh position={[0, 10.05, -0.25]}>
        <boxGeometry args={[0.38, 0.38, 1.1]} />
        <meshStandardMaterial color="#e5ece7" roughness={0.5} />
      </mesh>
      <mesh ref={beacon} position={[0, 10.3, -0.5]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color={[4, 0.3, 0.2]} toneMapped={false} />
      </mesh>
      <group ref={rotor} position={[0, 10.05, 0.38]} rotation-z={phase}>
        <mesh>
          <sphereGeometry args={[0.2, 16, 12]} />
          <meshStandardMaterial color="#eef3ef" roughness={0.4} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} geometry={blade} rotation-z={(i * Math.PI * 2) / 3}>
            <meshStandardMaterial color="#eef3ef" roughness={0.45} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function WindFarm({ lite, reduced }: { lite: boolean; reduced: boolean }) {
  const blade = useBladeGeometry();
  const list = lite ? TURBINES.slice(0, 9) : TURBINES;
  return (
    <group>
      {list.map(([x, z, s], i) => (
        <Turbine
          key={i}
          position={[x, terrainHeight(x, z) - 0.2, z]}
          scale={s}
          speed={0.55 + ((i * 37) % 10) / 22}
          phase={i * 1.7}
          blade={blade}
          reduced={reduced}
        />
      ))}
    </group>
  );
}

/* --------------------------------- Motes --------------------------------- */

function Motes({ count }: { count: number }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } },
        vertexShader: /* glsl */ `
          uniform float uTime; uniform float uPixelRatio;
          attribute float aSeed;
          varying float vSeed; varying float vFade;
          void main() {
            vec3 p = position;
            float t = uTime * (0.25 + aSeed * 0.35) + aSeed * 20.0;
            p.y = mod(p.y + t, 16.0);
            p.x += sin(t * 0.7 + aSeed * 6.28) * 0.6;
            vFade = smoothstep(0.0, 2.0, p.y) * (1.0 - smoothstep(11.0, 16.0, p.y));
            vSeed = aSeed;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (3.0 + aSeed * 5.0) * uPixelRatio / -mv.z;
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          varying float vSeed; varying float vFade;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d);
            vec3 col = mix(vec3(0.37, 0.89, 0.78), vec3(1.0, 0.76, 0.42), step(0.7, vSeed));
            gl_FragColor = vec4(col, a * vFade * 0.6);
          }`,
      }),
    [],
  );

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = (n: number) => {
        const v = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
        return v - Math.floor(v);
      };
      pos.set([(r(1) - 0.5) * 60, r(2) * 16, -r(3) * 50 + 10], i * 3);
      seed[i] = r(4);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  const { gl } = useThree();
  useFrame(({ clock }) => {
    const u = (ref.current?.material as THREE.ShaderMaterial | undefined)?.uniforms;
    if (!u) return;
    u.uTime.value = clock.elapsedTime;
    u.uPixelRatio.value = gl.getPixelRatio() * 30;
  });

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />;
}

/* ------------------------------- Camera rig ------------------------------ */

function CameraRig() {
  const look = useRef(new THREE.Vector3(0, 3, -40));
  useFrame(({ camera }, dt) => {
    const p = heroState.progress;
    const e = 1 - Math.pow(1 - p, 2);
    const d = Math.min(dt, 0.05);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, heroState.px * 1.2, 2.5, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 2.6 + e * 4.2 - heroState.py * 0.4, 2.5, d);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 15 - e * 15, 2.5, d);
    look.current.x = THREE.MathUtils.damp(look.current.x, heroState.px * 3, 2, d);
    look.current.y = THREE.MathUtils.damp(look.current.y, 4.2 - e * 1.2 - heroState.py * 1.2, 2, d);
    camera.lookAt(look.current);
  });
  return null;
}

/* --------------------------------- Scene --------------------------------- */

export default function HeroScene({ onReady }: { onReady?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [{ lite, reduced }] = useState(() => ({
    lite: window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4,
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  }));

  // Stop rendering entirely when the hero is off-screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      heroState.px = (e.clientX / window.innerWidth) * 2 - 1;
      heroState.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden>
      <Canvas
        frameloop={visible ? (reduced ? "demand" : "always") : "never"}
        dpr={[1, lite ? 1.5 : 1.75]}
        // Measure layout size, not the transformed box — the hero scales this in on intro.
        resize={{ offsetSize: true }}
        camera={{ fov: 42, near: 0.1, far: 900, position: [0, 2.6, 15] }}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.05;
          onReady?.();
        }}
      >
        <color attach="background" args={[FOG]} />
        <fog attach="fog" args={[FOG, 28, 190]} />
        <hemisphereLight args={["#8fd3c4", "#081610", 0.9]} />
        <directionalLight position={[SUN_DIR.x * 100, 18, SUN_DIR.z * 100]} color="#ffc488" intensity={2.6} />
        <directionalLight position={[-12, 9, 24]} color="#a8e3d6" intensity={0.55} />
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={3} color="#ffb366" position={[0, 6, -40]} scale={[80, 10, 1]} />
          <Lightformer form="rect" intensity={1} color="#2fb5a8" position={[0, 30, -10]} rotation-x={Math.PI / 2} scale={[80, 60, 1]} />
          <Lightformer form="rect" intensity={0.4} color="#ffffff" position={[0, 6, 40]} rotation-y={Math.PI} scale={[60, 8, 1]} />
        </Environment>
        <Sky />
        <Terrain />
        <SolarField lite={lite} />
        <WindFarm lite={lite} reduced={reduced} />
        {!reduced && <Motes count={lite ? 90 : 180} />}
        <CameraRig />
        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  );
}
