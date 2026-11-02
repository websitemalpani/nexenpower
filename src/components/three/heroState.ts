// Mutable bridge between GSAP/DOM and the R3F render loop (no React re-renders).
export const heroState = {
  /** 0 → 1 scroll progress through the hero. */
  progress: 0,
  /** Normalised pointer, -1 → 1. */
  px: 0,
  py: 0,
};

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Flat foreground for the solar field, rolling hills behind, mountain ridge on the horizon. */
export function terrainHeight(x: number, z: number) {
  const beyondField = Math.max(0, -z - 14);
  const hills =
    Math.sin(x * 0.08) * Math.cos(z * 0.06) * 1.3 +
    Math.sin(x * 0.023 + z * 0.04) * 1.6 +
    Math.sin(x * 0.17 + 1.3) * Math.sin(z * 0.13) * 0.4 +
    1.2;
  const ridge = smoothstep(85, 130, -z) * (9 + 4 * Math.sin(x * 0.045) + 3 * Math.sin(x * 0.11 + 2));
  const edges = smoothstep(30, 70, Math.abs(x)) * 4;
  return hills * smoothstep(0, 26, beyondField) + ridge + edges * smoothstep(0, 10, beyondField);
}
