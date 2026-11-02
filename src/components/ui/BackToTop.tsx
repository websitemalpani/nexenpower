"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";

const scrollTop = (lenis: ReturnType<typeof useLenis>) =>
  lenis ? lenis.scrollTo(0, { duration: 1.8 }) : window.scrollTo({ top: 0, behavior: "smooth" });

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
    <path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Round footer button: "BACK TO TOP" text spins around an arrow; spins faster and fills mint on hover. */
export function BackToTopBadge() {
  const lenis = useLenis();
  return (
    <button
      type="button"
      onClick={() => scrollTop(lenis)}
      aria-label="Back to top"
      className="group relative flex size-28 shrink-0 items-center justify-center rounded-full text-paper md:size-32"
    >
      <span aria-hidden className="absolute inset-0 scale-0 rounded-full bg-mint transition-transform duration-700 ease-(--ease-expo) group-hover:scale-100" />
      <svg
        viewBox="0 0 100 100"
        aria-hidden
        className="absolute inset-0 size-full animate-[spin_14s_linear_infinite] group-hover:animate-[spin_5s_linear_infinite] motion-reduce:animate-none"
      >
        <defs>
          <path id="btt-circle" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
        </defs>
        {/* textLength = the circle's circumference (2π·38), so the phrase wraps the ring exactly with no gap. */}
        <text className="fill-paper/75 font-mono text-[9px] uppercase transition-colors duration-500 group-hover:fill-ink">
          <textPath href="#btt-circle" textLength="238.5" lengthAdjust="spacing">
            Back to top • Back to top •
          </textPath>
        </text>
      </svg>
      <span className="relative flex size-11 items-center justify-center rounded-full bg-mint text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-mint">
        <Arrow className="size-5 transition-transform duration-500 ease-(--ease-expo) group-hover:-translate-y-1" />
      </span>
    </button>
  );
}

/** Floating button: appears after one screen of scrolling, hides at the footer; its ring fills with page progress. */
export function BackToTopFloating() {
  const lenis = useLenis();
  const ring = useRef<SVGCircleElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (ring.current) ring.current.style.strokeDashoffset = String(1 - p);
      // Show after one screen; step aside near the bottom, where the footer's own round button takes over.
      setVisible(window.scrollY > window.innerHeight && window.scrollY < max - 450);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => scrollTop(lenis)}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`group fixed right-5 bottom-5 z-50 flex size-14 items-center justify-center rounded-full bg-ink/80 text-paper shadow-[0_12px_30px_-10px_rgba(4,18,13,.6)] backdrop-blur-md transition-all duration-500 ease-(--ease-expo) hover:bg-mint hover:text-ink md:right-8 md:bottom-8 ${
        visible ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-6 scale-75 opacity-0"
      }`}
    >
      <svg viewBox="0 0 56 56" aria-hidden className="absolute inset-0 size-full -rotate-90">
        <circle cx="28" cy="28" r="26" fill="none" stroke="rgba(242,241,234,.15)" strokeWidth="2" />
        <circle ref={ring} cx="28" cy="28" r="26" fill="none" stroke="#5fe3c8" strokeWidth="2" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset="1" className="transition-[stroke] duration-500 group-hover:stroke-ink" />
      </svg>
      <Arrow className="relative size-5 transition-transform duration-500 ease-(--ease-expo) group-hover:-translate-y-0.5" />
    </button>
  );
}
