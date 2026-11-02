"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { partnerships } from "@/content/pages";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Arrow } from "@/components/ui/Button";

// One icon per partner type (same order as partnerships.types).
const icons: ReactNode[] = [
  <>
    <path pathLength={1} d="M12 3 3 8h18z" />
    <path pathLength={1} d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18" />
  </>,
  <>
    <path pathLength={1} d="M3 21V11l5 3v-3l5 3V7l8 4v10z" />
    <path pathLength={1} d="M7 17.5h2M12 17.5h2M17 17.5h1.5" />
  </>,
  <>
    <path pathLength={1} d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z" />
    <circle pathLength={1} cx="12" cy="10" r="2.2" />
  </>,
  <>
    <path pathLength={1} d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" />
  </>,
];

export function Partnerships() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Partner rows slide in from the right; their icons draw.
      gsap.set("[data-pt-icon] *", { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap
        .timeline({ scrollTrigger: { trigger: "[data-pt-rows]", start: "top 80%", once: true } })
        .from("[data-pt-row]", { opacity: 0, x: 80, filter: "blur(6px)", duration: 1.2, stagger: 0.12, ease: "expo.out", clearProps: "filter" })
        .to("[data-pt-icon] *", { strokeDashoffset: 0, duration: 1, stagger: 0.06, ease: "power2.inOut" }, 0.3);

      // Photo panel: clip reveal + parallax; checklist ticks in.
      gsap.fromTo(
        "[data-pt-photo]",
        { clipPath: "inset(15% 15% 15% 15% round 2rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 2rem)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: "[data-pt-photo]", start: "top 85%", once: true } },
      );
      gsap.fromTo("[data-pt-photo] img", { scale: 1.3, yPercent: -6 }, { scale: 1.1, yPercent: 6, ease: "none", scrollTrigger: { trigger: "[data-pt-photo]", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.from("[data-pt-strength]", { opacity: 0, y: 20, duration: 0.9, stagger: 0.09, ease: "expo.out", scrollTrigger: { trigger: "[data-pt-strengths]", start: "top 90%", once: true } });

      // Process: the rail fills with scroll and each step lights up as it's reached.
      gsap.fromTo("[data-pt-rail]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: "[data-pt-steps]", start: "top 75%", end: "bottom 55%", scrub: 0.6 } });
      gsap.from("[data-pt-step]", { opacity: 0, y: 40, duration: 1.1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: "[data-pt-steps]", start: "top 80%", once: true } });
      gsap.utils.toArray<HTMLElement>("[data-pt-step]").forEach((step, i) => {
        ScrollTrigger.create({ trigger: "[data-pt-steps]", start: `top+=${i * 60} 70%`, toggleClass: { targets: step, className: "is-lit" } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="home-partnerships" className="relative overflow-hidden bg-sand text-ink">
      <div className="container-x py-24 md:py-36">
        <div className="grid gap-8 md:grid-cols-12">
          <SectionLabel index="06" className="text-brand md:col-span-3">
            Partnerships
          </SectionLabel>
          <div className="md:col-span-9">
            <SplitReveal
              id="home-partnerships"
              text="Partnerships built for the long term."
              accent={["long", "term."]}
              className="display type-h2 text-balance [&_.accent]:text-brand"
            />
            <p className="mt-6 max-w-2xl text-ink/65 md:text-lg">{partnerships.lead}</p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:mt-24 lg:grid-cols-12 lg:gap-10">
          {/* Photo + strengths */}
          <div className="lg:col-span-5">
            <div data-pt-photo className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink lg:sticky lg:top-28">
              <Image src={partnerships.strengthsImage.src} alt={partnerships.strengthsImage.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-transparent" />
              <div data-pt-strengths className="absolute inset-x-4 bottom-4 rounded-3xl border border-paper/15 bg-ink/55 p-6 text-paper backdrop-blur-md md:inset-x-6 md:bottom-6 md:p-7">
                <p className="eyebrow text-mint">{partnerships.strengthsTitle}</p>
                <ul className="mt-5 space-y-3">
                  {partnerships.strengths.map((s) => (
                    <li key={s} data-pt-strength className="flex items-start gap-3 text-sm md:text-base">
                      <span aria-hidden className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-mint text-ink">
                        <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12 4.5 4.5L19 7" />
                        </svg>
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Partner types */}
          <ul data-pt-rows className="flex flex-col gap-3 lg:col-span-7">
            {partnerships.types.map((t, i) => (
              <li key={t.title} data-pt-row>
                <Link
                  href="/contact"
                  className="group relative flex items-start gap-5 overflow-hidden rounded-3xl bg-paper p-6 transition-colors duration-500 hover:text-paper md:gap-8 md:p-9"
                >
                  {/* Ink fill that wipes in from the left on hover */}
                  <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-700 ease-(--ease-expo) group-hover:scale-x-100" />
                  <span aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(60%_120%_at_100%_0%,rgba(95,227,200,.18),transparent_60%)]" />

                  <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-all duration-700 ease-(--ease-expo) group-hover:rotate-[-8deg] group-hover:bg-mint group-hover:text-ink md:size-16">
                    <svg data-pt-icon viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {icons[i]}
                    </svg>
                  </span>

                  <span className="relative flex-1">
                    <span className="font-mono text-xs text-brand transition-colors duration-500 group-hover:text-mint">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mt-2 block text-xl font-semibold tracking-tight md:text-2xl">{t.title}</span>
                    <span className="mt-2 block max-w-lg leading-relaxed text-ink/60 transition-colors duration-500 group-hover:text-paper/65">{t.text}</span>
                  </span>

                  <span className="relative hidden size-12 shrink-0 items-center justify-center self-center rounded-full border border-ink/15 transition-all duration-700 ease-(--ease-expo) group-hover:-rotate-45 group-hover:border-mint group-hover:bg-mint group-hover:text-ink sm:flex">
                    <Arrow className="size-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Process */}
        <div className="mt-24 md:mt-32">
          <p className="eyebrow text-brand">How it works</p>
          <h3 className="mt-4 max-w-xl text-2xl font-semibold tracking-tight md:text-4xl">A clear path from first call to delivery.</h3>

          <ol data-pt-steps className="relative mt-12 grid gap-8 md:mt-16 md:grid-cols-4 md:gap-6">
            <span aria-hidden className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-px bg-ink/15 md:block" />
            <span aria-hidden data-pt-rail className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-px origin-left bg-linear-to-r from-brand via-teal to-mint md:block" />
            {partnerships.process.map((s, i) => (
              <li key={s.title} data-pt-step className="group/step relative flex gap-5 md:flex-col md:items-center md:text-center">
                <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-sand font-mono text-sm text-ink/50 transition-all duration-700 group-[.is-lit]/step:border-brand group-[.is-lit]/step:bg-brand group-[.is-lit]/step:text-paper group-[.is-lit]/step:shadow-[0_0_0_8px_rgba(3,107,65,.12)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-lg font-semibold tracking-tight md:mt-6 md:text-xl">{s.title}</span>
                  <span className="mt-2 block max-w-xs text-sm leading-relaxed text-ink/60 md:mx-auto md:text-base">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
