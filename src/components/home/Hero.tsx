"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { hero, stats } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onIntroReady } from "@/lib/intro";
import { heroState } from "@/components/three/heroState";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Counter } from "@/components/ui/Counter";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [sceneReady, setSceneReady] = useState(false);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      // Scroll progress feeds the 3D camera; copy drifts up and dissolves.
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => (heroState.progress = self.progress),
        },
      })
        .to("[data-hero-copy]", { yPercent: reduce ? 0 : -18, opacity: 0, filter: reduce ? "none" : "blur(10px)", ease: "none" }, 0.15)
        .to("[data-hero-stage]", { scale: reduce ? 1 : 1.12, ease: "none" }, 0)
        .to("[data-hero-stats]", { opacity: 0, y: reduce ? 0 : 40, ease: "none" }, 0.25)
        .to("[data-hero-scrim]", { opacity: 1, ease: "none" }, 0.4);

      if (reduce) return;
      gsap.set("[data-hero-fade]", { opacity: 0, y: 24 });
      gsap.set("[data-hero-lens]", { scale: 1.3, filter: "brightness(0.25) saturate(0.6)" });
      gsap.set("[data-hero-bar]", { scaleY: 1 });
      gsap.set("[data-hero-flare]", { xPercent: -60, opacity: 0 });

      // Slow mouse parallax: copy and scene drift against each other.
      const xCopy = gsap.quickTo("[data-hero-parallax]", "x", { duration: 1.6, ease: "power3.out" });
      const yCopy = gsap.quickTo("[data-hero-parallax]", "y", { duration: 1.6, ease: "power3.out" });
      const xScene = gsap.quickTo("[data-hero-lens]", "x", { duration: 2.2, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        xCopy(dx * -18);
        yCopy(dy * -10);
        xScene(dx * 30);
      };
      const off = onIntroReady(() => {
        gsap
          .timeline()
          // Letterbox opens, camera pulls back from a dark close-up as the light comes up.
          .to("[data-hero-bar]", { scaleY: 0, duration: 1.6, ease: "expo.inOut" }, 0)
          .to("[data-hero-lens]", { scale: 1, filter: "brightness(1) saturate(1)", duration: 3.4, ease: "expo.out", clearProps: "filter" }, 0)
          // Warm light leak sweeps across the frame.
          .to("[data-hero-flare]", { opacity: 1, duration: 0.8, ease: "power2.out" }, 0.6)
          .to("[data-hero-flare]", { xPercent: 60, duration: 3, ease: "power2.inOut" }, 0.6)
          .to("[data-hero-flare]", { opacity: 0, duration: 1.2, ease: "power2.in" }, 2.4)
          .fromTo("[data-hero-rule]", { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, 1)
          .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 1.6, stagger: 0.15, ease: "expo.out" }, 1.2)
          .add(() => window.addEventListener("pointermove", onMove), 1.5);
      });
      return () => {
        off();
        window.removeEventListener("pointermove", onMove);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative h-[185svh] bg-ink text-paper">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div data-hero-stage className="absolute inset-0">
          <div data-hero-lens className="absolute inset-[-3%]">
            {/* Painted poster under the canvas â€” also the no-WebGL fallback. */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 40% at 55% 58%, rgba(240,162,90,.55), transparent 70%), linear-gradient(180deg,#020d0a 0%,#0b3a36 48%,#c98a50 62%,#0c2419 64%,#06140f 100%)",
              }}
            />
            <div className={`absolute inset-0 transition-opacity duration-1600 ${sceneReady ? "opacity-100" : "opacity-0"}`}>
              <HeroScene onReady={() => setSceneReady(true)} />
            </div>
          </div>
        </div>

        {/* Warm light leak that sweeps across on the intro. */}
        <div
          data-hero-flare
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/4 w-[70%] opacity-0 mix-blend-screen"
          style={{ background: "radial-gradient(45% 55% at 50% 55%, rgba(255,186,110,.45), rgba(255,140,60,.12) 45%, transparent 70%)" }}
        />
        <div className="grain pointer-events-none absolute inset-0 opacity-60" aria-hidden />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,18,13,.55)_0%,transparent_30%,transparent_45%,rgba(4,18,13,.85)_100%)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_25%_60%,rgba(4,18,13,.6),transparent_75%)]" />
        <div data-hero-scrim aria-hidden className="pointer-events-none absolute inset-0 bg-ink opacity-0" />

        {/* Letterbox bars, picked up from the preloader and opened on the intro. */}
        <div data-hero-bar aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[12vh] origin-top bg-black" style={{ transform: "scaleY(0)" }} />
        <div data-hero-bar aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[12vh] origin-bottom bg-black" style={{ transform: "scaleY(0)" }} />

        <div className="relative z-10 flex h-full flex-col justify-end">
          <div data-hero-copy className="container-x pb-10 md:pb-14">
            <div data-hero-parallax>
              <p data-hero-fade className="eyebrow mb-6 flex items-center gap-3 text-mint">
                <span data-hero-rule className="hidden h-px w-10 origin-left bg-mint/60 sm:block" aria-hidden />
                {hero.eyebrow}
              </p>
              <SplitReveal
                as="h1"
                immediate
                delay={0.5}
                stagger={0.1}
                blur
                text={hero.title}
                accent={["$300", "Billion"]}
                className="hero-title display max-w-[15ch] type-hero text-balance"
              />
              <div data-hero-fade className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-center md:justify-between">
                <p className="max-w-md text-base text-paper/75 md:text-lg">{hero.subtitle}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Magnetic>
                    <Button href="/contact" variant="light">
                      Partner with us
                    </Button>
                  </Magnetic>
                  <Button href="/about" variant="outline-light">
                    Our story
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div data-hero-stats className="border-t border-paper/15 bg-ink/30 backdrop-blur-md">
            <dl className="container-x grid grid-cols-3 divide-x divide-paper/10">
              {stats.map((s, i) => (
                <div key={s.label} data-hero-fade className={`py-5 md:py-7 ${i === 0 ? "pr-3 md:pr-8" : "px-3 md:px-8"}`}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <p className="flex items-baseline gap-1.5 type-stat font-semibold tracking-[-0.04em] tabular-nums">
                      <Counter value={s.value} suffix={s.suffix} immediate delay={0.7 + i * 0.15} />
                      <span className="text-[0.45em] font-medium tracking-tight text-mint">{s.unit}</span>
                    </p>
                    <p aria-hidden className="mt-2 text-[0.7rem] leading-snug text-paper/55 md:text-sm">
                      {s.label}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
