"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { markIntroReady } from "@/lib/intro";

const SEEN_KEY = "nexen:intro-seen";
const LOGO = "/images/brand/nexen-logo-light.webp";
const STATUS = ["Harnessing the sun", "Capturing the wind", "Storing the surplus", "Synchronising the grid", "Grid online"];

const shineStyle = {
  backgroundImage: "linear-gradient(105deg, transparent 40%, rgba(94,230,200,.95) 50%, transparent 60%)",
  backgroundSize: "250% 100%",
  backgroundPosition: "160% 0",
  maskImage: `url(${LOGO})`,
  WebkitMaskImage: `url(${LOGO})`,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
} as const;

/**
 * Cinematic intro: letterbox bars close in, a beam of light splits open to
 * reveal the logo, the counter charges through status lines, then a power
 * surge flashes and the camera pushes through the logo into the page.
 * Always plays when landing on the home page; other pages play it once per session.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const status = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    const isHome = window.location.pathname === "/";

    const finish = () => {
      setDone(true);
      document.documentElement.classList.remove("is-loading");
    };

    // A context lets cleanup revert every tween, so React's dev double-run
    // doesn't leave elements parked at their "from" state.
    const ctx = gsap.context(() => {
      if ((seen && !isHome) || prefersReducedMotion()) {
        gsap.to(el, { autoAlpha: 0, duration: 0.5, ease: "power2.out", onStart: markIntroReady, onComplete: finish });
        return;
      }

      const counter = { v: 0 };
      let step = -1;
      const setStatus = (i: number) => {
        if (i === step || !status.current) return;
        step = i;
        gsap.timeline()
          .to(status.current, { opacity: 0, y: -6, duration: 0.15, ease: "power1.in" })
          .add(() => {
            if (status.current) status.current.textContent = STATUS[i];
          })
          .fromTo(status.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" })
          .to(status.current, { opacity: 0.4, duration: 0.05, repeat: 3, yoyo: true });
      };

      gsap
        .timeline({ onComplete: finish })
        // Letterbox + chrome
        .fromTo("[data-pl-bar]", { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: "expo.inOut" }, 0)
        .fromTo("[data-pl-chrome]", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "expo.out" }, 0.5)
        // Beam ignites at the centre…
        .fromTo("[data-pl-beam]", { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 1, ease: "expo.inOut" }, 0.4)
        // …then splits open to reveal the logo, which comes into focus
        .to("[data-pl-beam='top']", { top: "-12%", duration: 1.2, ease: "expo.inOut" }, 1.3)
        .to("[data-pl-beam='bottom']", { top: "112%", duration: 1.2, ease: "expo.inOut" }, 1.3)
        .fromTo("[data-pl-reveal]", { clipPath: "inset(50% 0 50% 0)" }, { clipPath: "inset(-12% 0 -12% 0)", duration: 1.2, ease: "expo.inOut" }, 1.3)
        .fromTo(
          "[data-pl-logo]",
          { scale: 1.15, filter: "blur(18px) brightness(3)" },
          { scale: 1, filter: "blur(0px) brightness(1)", duration: 1.8, ease: "power3.out" },
          1.3,
        )
        .to("[data-pl-beam]", { opacity: 0, duration: 0.6 }, 2.4)
        .fromTo("[data-pl-glow]", { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, ease: "power3.out" }, 1.4)
        .to("[data-pl-glow]", { scale: 1.12, opacity: 0.7, duration: 0.9, repeat: 1, yoyo: true, ease: "sine.inOut" }, 3.2)
        // Two light sweeps across the logo
        .fromTo("[data-pl-shine]", { backgroundPosition: "160% 0" }, { backgroundPosition: "-60% 0", duration: 1.2, ease: "power2.inOut" }, 2.3)
        .fromTo("[data-pl-shine]", { backgroundPosition: "160% 0" }, { backgroundPosition: "-60% 0", duration: 0.9, ease: "power2.inOut" }, 3.9)
        // Charge
        .to(
          counter,
          {
            v: 100,
            duration: 4.6,
            ease: "power1.inOut",
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
              setStatus(Math.min(STATUS.length - 1, Math.floor(counter.v / (100 / (STATUS.length - 1)))));
            },
          },
          0.4,
        )
        .fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, duration: 4.6, ease: "power1.inOut" }, 0.4)
        // Power surge
        .to("[data-pl-glow]", { scale: 2.2, opacity: 1, duration: 0.5, ease: "power2.in" }, 5)
        .to("[data-pl-logo]", { x: 2, duration: 0.04, repeat: 7, yoyo: true, ease: "none" }, 5.1)
        .fromTo("[data-pl-flash]", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.in" }, 5.25)
        .add(markIntroReady, 5.5)
        // Push through the logo into the page
        .to("[data-pl-chrome]", { opacity: 0, duration: 0.3 }, 5.3)
        .to("[data-pl-bar]", { scaleY: 0, duration: 0.9, ease: "expo.inOut" }, 5.5)
        .to("[data-pl-logo]", { scale: 7, opacity: 0, filter: "blur(24px) brightness(2)", duration: 1, ease: "power3.in" }, 5.3)
        .to(el, { autoAlpha: 0, duration: 1.1, ease: "power2.out" }, 5.6);
    }, el);

    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-100 overflow-hidden bg-ink text-paper"
      role="status"
      aria-label="Loading NEXEN POWER"
    >
      <div
        data-pl-glow
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(11,147,147,.4)_0%,rgba(3,107,65,.18)_35%,transparent_65%)]"
      />
      <div className="grain pointer-events-none absolute inset-0" aria-hidden />

      {/* Logo + beam */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[min(70vw,440px)]">
          <div data-pl-reveal style={{ clipPath: "inset(50% 0 50% 0)" }}>
            <div data-pl-logo className="relative">
              <Image src={LOGO} alt="" width={800} height={291} priority className="h-auto w-full" />
              <div data-pl-shine aria-hidden className="absolute inset-0" style={shineStyle} />
            </div>
          </div>
          {(["top", "bottom"] as const).map((k) => (
            <div
              key={k}
              data-pl-beam={k}
              aria-hidden
              className="absolute top-1/2 left-1/2 h-px w-[120vw] max-w-[1400px] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,#5ee6c8_35%,#fff_50%,#5ee6c8_65%,transparent)] shadow-[0_0_18px_4px_rgba(94,230,200,.55)]"
              style={{ transform: "scaleX(0)" }}
            />
          ))}
        </div>
      </div>

      {/* Letterbox bars carry the chrome */}
      <div data-pl-bar className="absolute inset-x-0 top-0 flex h-[12vh] origin-top items-center bg-black px-6 md:px-10">
        <div data-pl-chrome className="eyebrow flex w-full justify-between text-paper/50">
          <span>Independent Power Producer</span>
          <span className="hidden sm:inline">Solar · Wind · Hybrid · BESS</span>
        </div>
      </div>
      <div data-pl-bar className="absolute inset-x-0 bottom-0 flex h-[12vh] origin-bottom items-center bg-black px-6 md:px-10">
        <div data-pl-chrome className="flex w-full items-center justify-between gap-6">
          <span ref={status} className="eyebrow w-44 shrink-0 text-mint md:w-56">
            Initialising
          </span>
          <div className="relative h-px flex-1 bg-paper/15">
            <div ref={bar} className="absolute inset-0 origin-left bg-linear-to-r from-brand via-teal to-mint shadow-[0_0_12px_rgba(94,230,200,.6)]" />
          </div>
          <p className="font-mono text-sm tabular-nums text-paper/70">
            <span ref={count}>000</span>
            <span className="text-paper/40"> % charged</span>
          </p>
        </div>
      </div>

      <div data-pl-flash aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#ffffff_0%,#5ee6c8_45%,rgba(94,230,200,.4)_100%)] opacity-0" />
    </div>
  );
}
