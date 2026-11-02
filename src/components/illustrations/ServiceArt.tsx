import type { CSSProperties } from "react";
import type { ServiceKind } from "@/content/site";

// Bespoke, code-drawn artwork for each service line (no stock imagery).
// All motion is CSS-only and is disabled by prefers-reduced-motion in globals.css.

const spin = (x: number, y: number, seconds: number, reverse = false): CSSProperties => ({
  transformBox: "view-box",
  transformOrigin: `${x}px ${y}px`,
  animation: `spin ${seconds}s linear infinite${reverse ? " reverse" : ""}`,
});

const flow = (seconds: number, delay = 0): CSSProperties => ({
  strokeDasharray: "6 10",
  animation: `dash ${seconds}s linear ${delay}s infinite`,
});

function Defs() {
  return (
    <defs>
      <linearGradient id="g-panel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1b4d75" />
        <stop offset="1" stopColor="#0a2238" />
      </linearGradient>
      <radialGradient id="g-sun" cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#fff1d6" />
        <stop offset=".35" stopColor="#f3b54a" />
        <stop offset="1" stopColor="#f3b54a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="g-brand" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#036b41" />
        <stop offset=".55" stopColor="#0b9393" />
        <stop offset="1" stopColor="#5fe3c8" />
      </linearGradient>
      <linearGradient id="g-sweep" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset=".5" stopColor="#fff" stopOpacity=".5" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="g-ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0f3325" />
        <stop offset="1" stopColor="#071c14" />
      </linearGradient>
    </defs>
  );
}

/* --------------------------------- Solar --------------------------------- */

function panelRows() {
  const rows: { points: string; cells: string }[] = [];
  for (let r = 0; r < 4; r++) {
    const y = 352 + r * 48 + r * r * 8;
    const h = 20 + r * 9;
    const w = 58 + r * 16;
    const gap = 10 + r * 3;
    const count = 7;
    const total = count * w + (count - 1) * gap;
    const x0 = 300 - total / 2;
    for (let i = 0; i < count; i++) {
      const x = x0 + i * (w + gap);
      const skew = (x + w / 2 - 300) * 0.12;
      const tl = [x + skew * 0.6, y];
      const tr = [x + w + skew * 0.6, y];
      const br = [x + w + skew, y + h];
      const bl = [x + skew, y + h];
      const lerp = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      let cells = "";
      for (const t of [1 / 3, 2 / 3]) {
        const a = lerp(tl, tr, t), b = lerp(bl, br, t);
        cells += `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
      }
      const a = lerp(tl, bl, 0.5), b = lerp(tr, br, 0.5);
      cells += `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
      rows.push({ points: [tl, tr, br, bl].map((p) => p.join(",")).join(" "), cells });
    }
  }
  return rows;
}

const PANELS = panelRows();

function SolarArt() {
  return (
    <svg viewBox="0 0 600 600" className="h-full w-full" aria-hidden>
      <Defs />
      <circle cx="300" cy="300" r="190" fill="url(#g-sun)" opacity=".35" />
      <g style={spin(300, 300, 60)} stroke="#f3b54a" strokeOpacity=".25" strokeWidth="1.5">
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return <line key={i} x1={300 + Math.cos(a) * 96} y1={300 + Math.sin(a) * 96} x2={300 + Math.cos(a) * 150} y2={300 + Math.sin(a) * 150} />;
        })}
      </g>
      <circle cx="300" cy="300" r="70" fill="url(#g-sun)" />
      <rect x="0" y="336" width="600" height="264" fill="url(#g-ground)" />
      <line x1="0" y1="336" x2="600" y2="336" stroke="#f3b54a" strokeOpacity=".5" />
      <clipPath id="clip-panels">
        {PANELS.map((p, i) => (
          <polygon key={i} points={p.points} />
        ))}
      </clipPath>
      {PANELS.map((p, i) => (
        <g key={i}>
          <polygon points={p.points} fill="url(#g-panel)" stroke="#9fc3d6" strokeOpacity=".5" strokeWidth="1" />
          <path d={p.cells} stroke="#9fc3d6" strokeOpacity=".3" strokeWidth=".8" />
        </g>
      ))}
      <g clipPath="url(#clip-panels)">
        <rect x="0" y="330" width="220" height="280" fill="url(#g-sweep)" style={{ animation: "sweep 5s ease-in-out infinite" }} />
      </g>
    </svg>
  );
}

/* ---------------------------------- Wind --------------------------------- */

function Turbine({ x, y, s, speed }: { x: number; y: number; s: number; speed: number }) {
  const blade = `M0 0 C ${6 * s} ${-14 * s}, ${5 * s} ${-70 * s}, ${1 * s} ${-108 * s} L ${-1 * s} ${-108 * s} C ${-3 * s} ${-64 * s}, ${-5 * s} ${-14 * s}, 0 0Z`;
  return (
    <g>
      <path d={`M${x - 2.5 * s} ${y + 6} L${x - 5 * s} ${560} L${x + 5 * s} ${560} L${x + 2.5 * s} ${y + 6}Z`} fill="#d9e2dc" opacity=".9" />
      <g style={spin(x, y, speed)}>
        {[0, 120, 240].map((r) => (
          <path key={r} d={blade} transform={`translate(${x} ${y}) rotate(${r})`} fill="#eef3ef" />
        ))}
      </g>
      <circle cx={x} cy={y} r={5 * s} fill="#fff" />
    </g>
  );
}

function WindArt() {
  return (
    <svg viewBox="0 0 600 600" className="h-full w-full" aria-hidden>
      <Defs />
      <circle cx="420" cy="220" r="200" fill="url(#g-brand)" opacity=".12" />
      {[150, 210, 270, 330].map((y, i) => (
        <path
          key={y}
          d={`M-20 ${y} C 120 ${y - 30}, 220 ${y + 30}, 360 ${y} S 560 ${y - 20}, 640 ${y}`}
          fill="none"
          stroke="#5fe3c8"
          strokeOpacity={0.18 + i * 0.05}
          strokeLinecap="round"
          style={flow(2.2 + i * 0.4, i * 0.3)}
        />
      ))}
      <path d="M0 520 C 140 470, 260 500, 380 480 S 560 470, 600 490 V600 H0Z" fill="#0f3325" />
      <Turbine x={150} y={330} s={0.72} speed={7} />
      <Turbine x={470} y={290} s={0.85} speed={6} />
      <Turbine x={310} y={200} s={1.15} speed={5} />
      <path d="M0 545 C 160 515, 300 540, 440 525 S 560 525, 600 535 V600 H0Z" fill="#071c14" />
    </svg>
  );
}

/* ------------------------------ Hybrid & BESS ----------------------------- */

function StorageArt() {
  const units = [90, 240, 390];
  return (
    <svg viewBox="0 0 600 600" className="h-full w-full" aria-hidden>
      <Defs />
      <circle cx="300" cy="320" r="230" fill="url(#g-brand)" opacity=".1" />

      {/* sources */}
      <circle cx="110" cy="120" r="34" fill="url(#g-sun)" />
      <g transform="translate(490 128)">
        <line x1="0" y1="0" x2="0" y2="60" stroke="#d9e2dc" strokeWidth="3" />
        <g style={spin(490, 128, 4)}>
          {[0, 120, 240].map((r) => (
            <path key={r} d="M0 0 C 3 -8, 3 -30, 1 -44 L -1 -44 C -2 -28, -3 -8, 0 0Z" transform={`rotate(${r})`} fill="#eef3ef" />
          ))}
        </g>
      </g>
      <path d="M140 140 C 200 200, 220 230, 300 262" fill="none" stroke="#f3b54a" strokeWidth="2" style={flow(1.6)} />
      <path d="M470 180 C 420 220, 380 240, 300 262" fill="none" stroke="#5fe3c8" strokeWidth="2" style={flow(1.6, 0.4)} />
      <circle cx="300" cy="262" r="7" fill="#5fe3c8" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />

      {/* battery containers */}
      {units.map((x, u) => (
        <g key={x}>
          <rect x={x} y="300" width="120" height="170" rx="10" fill="#0b2a1e" stroke="#5fe3c8" strokeOpacity=".35" />
          <rect x={x + 44} y="290" width="32" height="10" rx="3" fill="#5fe3c8" fillOpacity=".35" />
          {Array.from({ length: 5 }, (_, i) => (
            <rect
              key={i}
              x={x + 14}
              y={446 - i * 30}
              width="92"
              height="22"
              rx="4"
              fill="url(#g-brand)"
              style={{ animation: `pulse-dot 3s ease-in-out ${u * 0.3 + i * 0.25}s infinite` }}
            />
          ))}
        </g>
      ))}

      {/* grid output */}
      <path
        d="M30 530 Q 75 500 120 530 T 210 530 T 300 530 T 390 530 T 480 530 T 570 530"
        fill="none"
        stroke="#5fe3c8"
        strokeOpacity=".7"
        strokeWidth="2"
        style={flow(1.4)}
      />
      <line x1="0" y1="560" x2="600" y2="560" stroke="#f2f1ea" strokeOpacity=".12" />
    </svg>
  );
}

export function ServiceArt({ kind }: { kind: ServiceKind }) {
  if (kind === "solar") return <SolarArt />;
  if (kind === "wind") return <WindArt />;
  return <StorageArt />;
}
