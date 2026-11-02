"use client";

import { useRef, type ReactNode } from "react";
import { stats } from "@/content/site";
import { operations } from "@/content/pages";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Counter } from "@/components/ui/Counter";

// Line icons, one per capability (same order as operations.capabilities).
// pathLength="1" on every stroke lets them "draw" in with a single dash tween.
const icons: ReactNode[] = [
  <>
    <rect pathLength={1} x="3" y="4" width="18" height="13" rx="2" />
    <path pathLength={1} d="M6.5 11.5h2.5l1.5-3 2.5 6 1.5-3h3" />
    <path pathLength={1} d="M9 21h6M12 17v4" />
  </>,
  <>
    <path pathLength={1} d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3.6 17.2a1.6 1.6 0 0 0 2.3 2.3l5.7-5.7a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.1-.6-.6-2.1z" />
  </>,
  <>
    <path pathLength={1} d="M12 3 7.5 21M12 3l4.5 18" />
    <path pathLength={1} d="M4 7h16M6 11h12M9 16h6" />
    <path pathLength={1} d="M4 7v2M20 7v2" />
  </>,
  <>
    <path pathLength={1} d="M3 17l6-6 4 4 8-8" />
    <path pathLength={1} d="M15 7h6v6" />
  </>,
  <>
    <path pathLength={1} d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" />
    <path pathLength={1} d="m8.5 12 2.5 2.5 4.5-5" />
  </>,
  <>
    <path pathLength={1} d="M20 12a8 8 0 0 1-14.3 4.9M4 12a8 8 0 0 1 14.3-4.9" />
    <path pathLength={1} d="M18.5 3v4.2h-4.2M5.5 21v-4.2h4.2" />
  </>,
];

// Decorative generation curve for the control-room panel (not data).
const LINE = "M0 120 C30 118 45 96 70 92 S110 60 140 58 S185 30 210 34 S255 52 280 46 S330 18 360 24 S390 40 400 38";
const AREA = `${LINE} L400 160 L0 160 Z`;

export function Operations() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Cards tilt up out of a blur, then their icons draw in.
      gsap.set("[data-op-card]", { opacity: 0, y: 70, rotateX: 14, transformPerspective: 900, filter: "blur(8px)" });
      gsap.set("[data-op-icon] *", { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap
        .timeline({ scrollTrigger: { trigger: "[data-op-cards]", start: "top 78%", once: true } })
        .to("[data-op-card]", { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", duration: 1.3, stagger: 0.12, ease: "expo.out", clearProps: "filter" })
        .to("[data-op-icon] *", { strokeDashoffset: 0, duration: 1.1, stagger: 0.05, ease: "power2.inOut" }, 0.35)
        .fromTo("[data-op-ring]", { scale: 0.6, opacity: 0.9 }, { scale: 1.9, opacity: 0, duration: 1.2, stagger: 0.12, ease: "power2.out" }, 0.5);

      // Panel: rises in, curve draws with scroll, scan line and equaliser loop.
      gsap.from("[data-op-panel]", { opacity: 0, y: 60, scale: 0.96, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: "[data-op-panel]", start: "top 85%", once: true } });
      gsap.fromTo("[data-op-line]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: "[data-op-panel]", start: "top 85%", end: "center 40%", scrub: 1 } });
      gsap.fromTo("[data-op-area]", { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: "[data-op-panel]", start: "top 70%", end: "center 40%", scrub: 1 } });
      gsap.fromTo("[data-op-scan]", { left: "0%" }, { left: "100%", duration: 4.5, repeat: -1, ease: "none" });
      gsap.utils.toArray<HTMLElement>("[data-op-eq]").forEach((bar, i) => {
        gsap.fromTo(bar, { scaleY: 0.25 }, { scaleY: () => gsap.utils.random(0.45, 1), duration: gsap.utils.random(0.6, 1.1), repeat: -1, yoyo: true, repeatRefresh: true, ease: "sine.inOut", delay: i * 0.08 });
      });
      gsap.to("[data-op-glow]", { xPercent: 20, yPercent: -10, scale: 1.15, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut" });
    },
    { scope: root },
  );

  // Cursor-following spotlight on the cards.
  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-op-card]");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - r.left}px`);
    card.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <section ref={root} aria-labelledby="home-operations" className="relative overflow-hidden bg-ink text-paper">
      <div
        data-op-glow
        aria-hidden
        className="pointer-events-none absolute -top-1/4 -left-1/4 size-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(11,147,147,.18)_0%,rgba(3,107,65,.08)_40%,transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(242,241,234,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(242,241,234,.035)_1px,transparent_1px)] bg-size-[64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <div className="container-x relative py-24 md:py-36">
        <div className="grid gap-8 md:grid-cols-12">
          <SectionLabel index="04" className="text-mint md:col-span-3">
            Operations
          </SectionLabel>
          <div className="md:col-span-9">
            <SplitReveal
              id="home-operations"
              text="How we keep assets performing."
              accent={["performing."]}
              className="display type-h2 text-balance [&_.accent]:text-mint"
            />
            <p className="mt-6 max-w-2xl text-paper/60 md:text-lg">{operations.intro[1]}</p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:mt-24 lg:grid-cols-12 lg:gap-8">
          {/* Control-room panel */}
          <div className="lg:col-span-5">
            <div data-op-panel className="rounded-[2rem] border border-paper/10 bg-night/80 p-6 backdrop-blur md:p-8 lg:sticky lg:top-28">
              <div className="flex items-center justify-between">
                <p className="eyebrow flex items-center gap-2 text-paper/60">
                  <span className="relative flex size-2">
                    <span className="absolute inset-0 rounded-full bg-mint opacity-60 motion-safe:animate-ping" />
                    <span className="relative size-2 rounded-full bg-mint" />
                  </span>
                  Portfolio monitoring
                </p>
                <span className="font-mono text-[0.65rem] tracking-widest text-mint/70">24 × 7</span>
              </div>

              <div aria-hidden className="relative mt-6 overflow-hidden rounded-2xl border border-paper/5 bg-ink/60">
                <svg viewBox="0 0 400 160" className="block h-auto w-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="op-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5fe3c8" stopOpacity=".35" />
                      <stop offset="100%" stopColor="#5fe3c8" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="op-line" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0b9393" />
                      <stop offset="60%" stopColor="#5fe3c8" />
                      <stop offset="100%" stopColor="#f3b54a" />
                    </linearGradient>
                  </defs>
                  {[40, 80, 120].map((y) => (
                    <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="rgba(242,241,234,.06)" strokeDasharray="3 5" />
                  ))}
                  <path data-op-area d={AREA} fill="url(#op-area)" />
                  <path data-op-line d={LINE} pathLength={1} fill="none" stroke="url(#op-line)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1" />
                </svg>
                <div data-op-scan className="absolute inset-y-0 w-px bg-linear-to-b from-transparent via-mint to-transparent shadow-[0_0_14px_2px_rgba(95,227,200,.45)]" />
              </div>

              {/* One bar per state in the portfolio */}
              <div aria-hidden className="mt-6 flex h-14 items-end gap-1.5">
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} data-op-eq className="h-full flex-1 origin-bottom rounded-t-md bg-linear-to-t from-brand/60 via-teal/70 to-mint/80" style={{ transform: `scaleY(${0.4 + ((i * 37) % 50) / 100})` }} />
                ))}
              </div>

              <dl className="mt-6 grid grid-cols-3 divide-x divide-paper/10 border-t border-paper/10 pt-6">
                {stats.map((s, i) => (
                  <div key={s.label} className={i === 0 ? "pr-3" : "px-3"}>
                    <dt className="text-[0.65rem] leading-snug text-paper/45 md:text-xs">{s.label}</dt>
                    <dd className="mt-2 flex items-baseline gap-1 text-2xl font-semibold tracking-tight tabular-nums md:text-3xl">
                      <Counter value={s.value} suffix={s.suffix} />
                      <span className="text-[0.5em] font-medium text-mint">{s.unit}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Capabilities */}
          <ul data-op-cards onPointerMove={onPointerMove} className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {operations.capabilities.map((item, i) => (
              <li
                key={item.title}
                data-op-card
                className="group relative overflow-hidden rounded-3xl border border-paper/10 bg-night p-7 transition-[border-color,background-color] duration-500 hover:border-mint/30 hover:bg-forest/70 md:p-8"
              >
                {/* Spotlight + top accent line */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "radial-gradient(320px circle at var(--x,50%) var(--y,50%), rgba(95,227,200,.13), transparent 70%)" }}
                />
                <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-linear-to-r from-transparent via-mint to-transparent transition-transform duration-700 ease-(--ease-expo) group-hover:scale-x-100" />

                <div className="relative flex items-start justify-between">
                  <span className="relative flex size-14 items-center justify-center rounded-2xl border border-mint/20 bg-mint/[.07] text-mint transition-transform duration-700 ease-(--ease-expo) group-hover:-rotate-6 group-hover:scale-110">
                    <span data-op-ring aria-hidden className="absolute inset-0 rounded-2xl border border-mint/50 opacity-0" />
                    <svg data-op-icon viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {icons[i]}
                    </svg>
                  </span>
                  <span className="font-mono text-xs text-paper/30 transition-colors duration-500 group-hover:text-mint">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="relative mt-10 text-xl font-semibold tracking-tight md:text-2xl">{item.title}</h3>
                <p className="relative mt-3 leading-relaxed text-paper/60">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
