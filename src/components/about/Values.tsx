"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { about } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";

// One icon per value (same order as about.values).
const icons: ReactNode[] = [
  <>
    <circle pathLength={1} cx="12" cy="12" r="9" />
    <path pathLength={1} d="M12 7v5l3.5 2" />
  </>,
  <>
    <path pathLength={1} d="M6 3h12l3 6-9 12L3 9z" />
    <path pathLength={1} d="M3 9h18M9 3l3 6 3-6M12 21 9 9M12 21l3-12" />
  </>,
  <>
    <circle pathLength={1} cx="11" cy="13" r="8" />
    <circle pathLength={1} cx="11" cy="13" r="4" />
    <path pathLength={1} d="m11 13 9-9M16 4h4v4" />
  </>,
  <>
    <path pathLength={1} d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z" />
    <path pathLength={1} d="M9.5 19h5M10.5 22h3" />
  </>,
  <>
    <circle pathLength={1} cx="9" cy="12" r="6" />
    <circle pathLength={1} cx="15" cy="12" r="6" />
  </>,
  <>
    <rect pathLength={1} x="5" y="4" width="14" height="17" rx="2" />
    <path pathLength={1} d="M9 4V2.5h6V4M9 13l2 2 4-4" />
  </>,
];

const CYCLE = 5; // seconds per value when auto-playing

/** Values as an interactive showcase: pick from the list, the feature panel animates in. Auto-advances until hovered. */
export function Values() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const paused = hovered || !inView;
  const values = about.values;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-value-item]", { opacity: 0, x: -40, duration: 1, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: "[data-value-list]", start: "top 80%", once: true } });
      gsap.from("[data-value-panel]", { opacity: 0, y: 60, scale: 0.96, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: "[data-value-panel]", start: "top 85%", once: true } });
      gsap.to("[data-value-glow]", { scale: 1.2, opacity: 0.7, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
    },
    { scope: root },
  );

  // Panel content animates only when the active value changes (not when auto-play pauses/resumes).
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Icon tile pops in while the strokes draw; opacity fades in with the draw so round caps never show as stray dots.
      gsap.fromTo("[data-value-icon]", { scale: 0.6, rotate: -20, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" });
      gsap.fromTo(
        "[data-value-icon] *",
        { strokeDasharray: "1 1", strokeDashoffset: 1, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: "power3.out", clearProps: "strokeDasharray,strokeDashoffset" },
      );
      gsap.fromTo("[data-value-copy] > *", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "expo.out" });
      gsap.fromTo("[data-value-num]", { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out" });
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  );

  // Progress bar drives auto-advance. Only beside the desktop panel; on phones it would collapse what someone is reading.
  useGSAP(
    () => {
      if (prefersReducedMotion() || paused || !window.matchMedia("(min-width: 1024px)").matches) return;
      const bar = gsap.fromTo("[data-value-progress]", { scaleX: 0 }, { scaleX: 1, duration: CYCLE, ease: "none", onComplete: () => setActive((a) => (a + 1) % values.length) });
      return () => bar.kill();
    },
    { scope: root, dependencies: [active, paused], revertOnUpdate: true },
  );

  // Only auto-advance while the section is on screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const v = values[active];

  return (
    <section ref={root} aria-labelledby="values-title" className="relative overflow-hidden bg-ink text-paper">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_40%,rgba(11,147,147,.14),transparent_70%)]" />
      <div className="container-x relative py-24 md:py-36">
        <div className="grid gap-8 md:grid-cols-12">
          <SectionLabel index="03" className="text-mint md:col-span-3">
            What we stand for
          </SectionLabel>
          <SplitReveal id="values-title" text="Values that power every partnership." accent={["every", "partnership."]} className="display type-h2 md:col-span-9 [&_.accent]:text-mint" />
        </div>

        <div className="mt-16 grid gap-8 md:mt-24 lg:grid-cols-12 lg:gap-12" onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
          {/* List */}
          <ul data-value-list className="divide-y divide-paper/10 border-y border-paper/10 lg:col-span-6">
            {values.map((item, i) => {
              const on = i === active;
              return (
                <li key={item.title} data-value-item>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-pressed={on}
                    className="group flex w-full items-center gap-5 py-5 text-left md:py-6"
                  >
                    <span className={`font-mono text-xs transition-colors duration-500 ${on ? "text-mint" : "text-paper/30"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={`type-h3 flex-1 font-semibold tracking-tight transition-all duration-700 ease-(--ease-expo) ${
                        on ? "translate-x-2 text-paper" : "text-paper/35 group-hover:text-paper/70"
                      }`}
                    >
                      {item.title}
                    </span>
                    <span
                      aria-hidden
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-700 ease-(--ease-expo) ${
                        on ? "-rotate-45 border-mint bg-mint text-ink" : "border-paper/15 text-paper/40"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </button>
                  {/* Small screens: the description sits under the active title */}
                  <p className={`overflow-hidden text-paper/60 transition-all duration-700 lg:hidden ${on ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"}`}>{item.text}</p>
                </li>
              );
            })}
          </ul>

          {/* Feature panel */}
          <div className="hidden lg:col-span-6 lg:block">
            <div data-value-panel aria-live="polite" className="sticky top-28 overflow-hidden rounded-4xl border border-paper/10 bg-linear-to-br from-forest to-night p-10 xl:p-12">
              <div data-value-glow aria-hidden className="absolute -top-24 -right-24 size-80 rounded-full bg-[radial-gradient(circle,rgba(95,227,200,.22),transparent_65%)] opacity-40" />
              <span data-value-num aria-hidden className="absolute -right-2 -bottom-10 text-[11rem] leading-none font-semibold tracking-[-0.06em] text-transparent select-none [-webkit-text-stroke:1px_rgba(95,227,200,.18)]">
                {String(active + 1).padStart(2, "0")}
              </span>

              <div className="relative flex size-20 items-center justify-center rounded-3xl border border-mint/25 bg-mint/10 text-mint">
                <svg key={active} data-value-icon viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {icons[active]}
                </svg>
              </div>

              <div key={`copy-${active}`} data-value-copy className="relative mt-16 min-h-[11rem] xl:mt-20">
                <p className="eyebrow text-mint">
                  Value {String(active + 1).padStart(2, "0")} of {String(values.length).padStart(2, "0")}
                </p>
                <h3 className="type-h2 display mt-4">{v.title}</h3>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-paper/65">{v.text}</p>
              </div>

              <div className="relative mt-10 h-px bg-paper/10">
                <span data-value-progress className="absolute inset-0 origin-left bg-linear-to-r from-teal to-mint" style={{ transform: "scaleX(0)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
