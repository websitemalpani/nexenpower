"use client";

import Image from "next/image";
import { useRef } from "react";
import { intro } from "@/content/site";
import { photos } from "@/content/pages";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrubText } from "@/components/ui/ScrubText";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

// Small animated graphic per pillar (same order as intro.pillars).
function PillarArt({ i }: { i: number }) {
  if (i === 0)
    // Operational excellence — steady output bars
    return (
      <svg viewBox="0 0 120 60" className="h-full w-full" fill="none" aria-hidden>
        {[22, 34, 28, 40, 36, 46, 42, 52].map((h, k) => (
          <rect key={k} data-pillar-bar x={k * 15} y={60 - h} width="9" height={h} rx="2" className={k === 7 ? "fill-mint" : "fill-mint/35"} />
        ))}
      </svg>
    );
  if (i === 1)
    // Growth platform — a line that climbs
    return (
      <svg viewBox="0 0 120 60" className="h-full w-full overflow-visible" fill="none" aria-hidden>
        <path d="M0 59h120" className="stroke-paper/10" />
        <path data-pillar-line pathLength={1} d="M2 52 26 44 44 48 66 30 84 34 116 8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-mint" />
        <circle data-pillar-dot cx="116" cy="8" r="4" className="fill-mint" />
        <circle data-pillar-dot cx="116" cy="8" r="9" className="fill-mint/20" />
      </svg>
    );
  // Future-ready — a charged bolt
  return (
    <svg viewBox="0 0 120 60" className="h-full w-full overflow-visible" fill="none" aria-hidden>
      <circle data-pillar-ring cx="60" cy="30" r="24" strokeWidth="1.2" className="stroke-mint/60" />
      <circle cx="60" cy="30" r="24" strokeWidth="1" className="stroke-mint/20" />
      <path d="M64 10 50 33h10l-3 17 14-23H61z" className="fill-mint" />
    </svg>
  );
}

export function Intro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Collage: photos wipe open, then drift at different speeds.
      gsap.fromTo("[data-intro-main]", { clipPath: "inset(100% 0 0 0 round 2rem)" }, { clipPath: "inset(0% 0 0 0 round 2rem)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: "[data-intro-collage]", start: "top 80%", once: true } });
      gsap.fromTo("[data-intro-inset]", { clipPath: "inset(0 100% 0 0 round 1.5rem)" }, { clipPath: "inset(0 0% 0 0 round 1.5rem)", duration: 1.4, delay: 0.5, ease: "expo.inOut", scrollTrigger: { trigger: "[data-intro-collage]", start: "top 80%", once: true } });
      gsap.fromTo("[data-intro-main] img", { scale: 1.3 }, { scale: 1.05, ease: "none", scrollTrigger: { trigger: "[data-intro-collage]", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo("[data-intro-inset]", { y: 80 }, { y: -40, ease: "none", scrollTrigger: { trigger: "[data-intro-collage]", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.from("[data-intro-badge]", { opacity: 0, scale: 0.8, y: 20, duration: 1, delay: 1.1, ease: "back.out(1.8)", scrollTrigger: { trigger: "[data-intro-collage]", start: "top 80%", once: true } });
      gsap.to("[data-intro-badge]", { y: -10, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut" });

      // Pillars rise in, then their graphics play.
      const pillars = gsap.timeline({ scrollTrigger: { trigger: "[data-intro-pillars]", start: "top 82%", once: true } });
      pillars
        .from("[data-intro-pillars]", { opacity: 0, y: 60, duration: 1.2, ease: "expo.out" })
        .from("[data-intro-pillar]", { opacity: 0, y: 30, duration: 1, stagger: 0.12, ease: "expo.out" }, 0.15)
        .from("[data-intro-divider]", { scale: 0, duration: 1.2, stagger: 0.12, ease: "expo.inOut" }, 0.2)
        .from("[data-pillar-bar]", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.9, stagger: 0.05, ease: "expo.out" }, 0.3)
        .fromTo("[data-pillar-line]", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0.45)
        .from("[data-pillar-dot]", { scale: 0, transformOrigin: "50% 50%", duration: 0.6, ease: "back.out(3)" }, 1.7);
      gsap.fromTo("[data-pillar-ring]", { scale: 0.8, opacity: 1 }, { scale: 1.5, opacity: 0, duration: 2, repeat: -1, ease: "power1.out", svgOrigin: "60 30" });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="intro-title" className="relative z-10 -mt-[22svh] rounded-t-4xl bg-paper md:rounded-t-[3rem]">
      <div className="container-x pt-24 pb-24 md:pt-36 md:pb-36">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Collage */}
          <div data-intro-collage className="relative lg:col-span-5">
            <SectionLabel index="01" className="text-brand">
              {intro.label}
            </SectionLabel>
            <div className="relative mt-10 pr-10 pb-16 md:pr-16">
              <div data-intro-main className="relative aspect-[4/5] overflow-hidden rounded-4xl bg-sand">
                <Image src={photos.solarSky.src} alt={photos.solarSky.alt} fill sizes="(min-width: 1024px) 36vw, 90vw" className="object-cover" />
              </div>
              <div data-intro-inset className="absolute right-0 bottom-0 w-[48%] overflow-hidden rounded-3xl border-4 border-paper shadow-[0_30px_60px_-25px_rgba(4,18,13,.45)]">
                <div className="relative aspect-square">
                  <Image src={photos.solarTechnician.src} alt={photos.solarTechnician.alt} fill sizes="(min-width: 1024px) 18vw, 45vw" className="object-cover" />
                </div>
              </div>
              <div data-intro-badge className="absolute top-6 -left-3 rounded-2xl bg-ink px-5 py-4 text-paper shadow-[0_20px_40px_-20px_rgba(4,18,13,.6)] md:-left-6">
                <p className="eyebrow text-mint">Independent Power Producer</p>
                <p className="mt-1 text-sm text-paper/70">Est. 2024 · Malpani Group</p>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="lg:col-span-7 lg:pt-16">
            <SplitReveal id="intro-title" text={intro.title} accent={["Strategic", "Purpose"]} className="display type-h2 text-balance text-ink [&_.accent]:text-brand" />
            <ScrubText text={intro.lead} accent={["operational", "excellence"]} className="type-lead mt-10 font-medium tracking-[-0.025em] text-ink [&_.accent]:text-brand" />
            <Reveal className="mt-10 border-l-2 border-brand/30 pl-6">
              <p className="text-base leading-relaxed text-ink/70 md:text-lg">{intro.body}</p>
            </Reveal>
            <Reveal className="mt-10">
              <Button href="/about" variant="outline-dark">
                Learn our story
              </Button>
            </Reveal>
          </div>
        </div>

        {/* Pillars */}
        <div
          data-intro-pillars
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
            e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
          }}
          className="group/panel relative mt-20 overflow-hidden rounded-4xl bg-ink text-paper md:mt-28"
        >
          {/* Faint grid + cursor light */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(242,241,234,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(242,241,234,.04)_1px,transparent_1px)] bg-size-[48px_48px]" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/panel:opacity-100"
            style={{ background: "radial-gradient(420px circle at var(--x,50%) var(--y,50%), rgba(95,227,200,.12), transparent 70%)" }}
          />

          <div className="relative grid md:grid-cols-3">
            {intro.pillars.map((p, i) => (
              <article key={p.title} data-intro-pillar className="group relative flex flex-col p-8 md:p-10 xl:p-12">
                {/* Column divider that draws in */}
                {i > 0 && <span aria-hidden data-intro-divider className="absolute inset-x-8 top-0 h-px origin-left bg-paper/10 md:inset-x-auto md:inset-y-10 md:left-0 md:h-auto md:w-px md:origin-top" />}

                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-mint">{String(i + 1).padStart(2, "0")}</span>
                  <span className="eyebrow text-paper/30">{["Today", "Growth", "Future"][i]}</span>
                </div>

                <div className="relative mt-8 flex h-28 items-end rounded-2xl border border-paper/10 bg-night/80 px-6 pt-6 pb-5 transition-colors duration-700 group-hover:border-mint/30">
                  <div aria-hidden className="absolute inset-0 rounded-2xl bg-[radial-gradient(60%_80%_at_50%_100%,rgba(95,227,200,.14),transparent_70%)] opacity-60 transition-opacity duration-700 group-hover:opacity-100" />
                  <div className="relative h-full w-full">
                    <PillarArt i={i} />
                  </div>
                </div>

                <h3 className="type-h3 mt-8 font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 mb-8 max-w-xs leading-relaxed text-paper/60">{p.text}</p>

                <div className="mt-auto h-px bg-paper/10">
                  <span className="block h-full origin-left scale-x-0 bg-linear-to-r from-teal to-mint transition-transform duration-1000 ease-(--ease-expo) group-hover:scale-x-100" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
