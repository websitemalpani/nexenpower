import { ImageResponse } from "next/og";

export const alt = "NEXEN POWER — Powering India’s Renewable Energy Transformation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#f2f1ea",
          background:
            "radial-gradient(70% 60% at 75% 70%, rgba(240,162,90,.45), transparent 70%), linear-gradient(180deg,#020d0a 0%,#0b3a36 60%,#06140f 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#5fe3c8" }}>INDEPENDENT POWER PRODUCER · INDIA</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>NEXEN POWER</div>
          <div style={{ fontSize: 40, marginTop: 24, maxWidth: 900, color: "rgba(242,241,234,.8)" }}>
            Powering India’s $300 Billion Renewable Energy Transformation
          </div>
        </div>
        <div style={{ display: "flex", gap: 48, fontSize: 30 }}>
          <span>580+ MW</span>
          <span>8 States</span>
          <span>25+ Years</span>
        </div>
      </div>
    ),
    size,
  );
}
