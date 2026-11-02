"use client";

import Image from "next/image";
import { useRef } from "react";
import { board } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

/** Board of directors. `compact` (home) links through to the About page instead of listing advisors. */
export function Board({ index, compact = false }: { index: string; compact?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-portrait]").forEach((card, i) => {
        const img = card.querySelector("img");
        const plate = card.querySelector("[data-plate]");
        gsap
          .timeline({ scrollTrigger: { trigger: card, start: "top 88%", once: true }, delay: (i % 4) * 0.12 })
          .fromTo(card, { clipPath: "inset(100% 0 0 0 round 1.75rem)" }, { clipPath: "inset(0% 0 0 0 round 1.75rem)", duration: 1.4, ease: "expo.inOut" })
          .fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: "expo.out" }, "<0.1")
          .from(plate, { yPercent: 120, opacity: 0, duration: 1, ease: "expo.out" }, "-=1.1");
      });

      // Gentle 3D tilt that follows the cursor.
      const offs = gsap.utils.toArray<HTMLElement>("[data-tilt]").map((el) => {
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3.out" });
        gsap.set(el, { transformPerspective: 1000 });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 10);
          rx(((e.clientY - r.top) / r.height - 0.5) * -10);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => offs.forEach((off) => off());
    },
    { scope: root },
  );

  return (
    <section id="board" ref={root} aria-labelledby="board-title" className="relative scroll-mt-20 overflow-hidden bg-paper text-ink">
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[-10%] size-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(3,107,65,.08),transparent_60%)]" />
      <div className="container-x relative py-24 md:py-36">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel index={index} className="text-brand">
              Leadership
            </SectionLabel>
            <SplitReveal
              id="board-title"
              text={board.title}
              accent={["Board", "Directors"]}
              className="display mt-8 type-h2 text-balance [&_.accent]:text-brand"
            />
          </div>
          <Reveal className="md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
            <div className="flex items-center gap-5 rounded-3xl border border-ink/10 bg-sand/70 p-5 transition-colors duration-500 hover:border-brand/30">
              <span className="flex h-20 w-16 shrink-0 items-center justify-center rounded-2xl bg-paper p-2.5 shadow-[0_10px_30px_-12px_rgba(4,18,13,.25)]">
                <Image src="/images/brand/malpani-group.webp" alt="Malpani Group logo" width={400} height={593} className="h-full w-auto" />
              </span>
              <p className="text-sm leading-relaxed text-ink/65">
                <span className="eyebrow mb-1.5 block text-brand">Backed by</span>
                <strong className="font-semibold text-ink">Malpani Group</strong> — a century-old family business in renewables for 25 years.
              </p>
            </div>
          </Reveal>
        </div>

        <ul className="mt-16 grid grid-cols-2 gap-3 md:mt-20 md:gap-5 lg:grid-cols-4">
          {board.members.map((m, i) => (
            <li key={m.name} data-tilt className="group [transform-style:preserve-3d]">
              <div
                data-portrait
                className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-linear-to-b from-sand to-[#d9d5c5] shadow-[0_30px_60px_-30px_rgba(4,18,13,.35)] transition-shadow duration-700 group-hover:shadow-[0_40px_80px_-30px_rgba(3,107,65,.45)]"
              >
                <Image
                  src={m.image}
                  alt={`Portrait of ${m.name}, ${m.role}`}
                  fill
                  sizes="(min-width: 1024px) 22vw, 46vw"
                  className="object-cover object-top mix-blend-multiply grayscale-[35%] transition-[filter,transform] duration-1000 ease-(--ease-expo) group-hover:scale-[1.05] group-hover:grayscale-0"
                />
                {/* Brand wash + mint edge glow on hover */}
                <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/10 to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-90" />
                <div aria-hidden className="absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-ink/5 transition-[box-shadow] duration-700 group-hover:ring-2 group-hover:ring-mint/60" />

                <span className="absolute top-4 left-4 rounded-full bg-paper/80 px-3 py-1 font-mono text-[0.65rem] tracking-widest text-ink/70 backdrop-blur md:top-5 md:left-5">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div data-plate className="absolute inset-x-3 bottom-3 rounded-2xl border border-paper/15 bg-ink/40 p-4 text-paper backdrop-blur-md md:inset-x-4 md:bottom-4 md:p-5">
                  <h3 className="text-base font-semibold tracking-tight md:text-xl">{m.name}</h3>
                  <p className="mt-1 flex items-center gap-2 text-xs text-paper/70 md:text-sm">
                    <span aria-hidden className="h-px w-4 bg-mint transition-all duration-700 ease-(--ease-expo) group-hover:w-8" />
                    {m.role}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {compact ? (
          <Reveal className="mt-16 flex justify-center">
            <Button href="/about#board" variant="outline-dark">
              Meet our leadership
            </Button>
          </Reveal>
        ) : (
          <Reveal className="mt-20 grid gap-6 border-t border-ink/15 pt-10 md:grid-cols-12">
            <h3 className="eyebrow text-brand md:col-span-3">{board.advisoryTitle}</h3>
            <ul className="flex flex-wrap gap-3 md:col-span-9">
              {board.advisory.map((name) => (
                <li key={name} className="rounded-full border border-ink/15 px-5 py-2.5 text-base transition-colors duration-500 hover:border-brand hover:bg-brand hover:text-paper">
                  {name}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
