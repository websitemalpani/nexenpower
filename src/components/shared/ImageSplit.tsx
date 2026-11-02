import type { ReactNode } from "react";
import type { Photo } from "@/content/pages";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/ParallaxImage";

type Props = {
  id: string;
  label: string;
  index?: string;
  title: string;
  accent?: string[];
  paragraphs: readonly string[];
  photo: Photo;
  /** Put the photo on the left. */
  reverse?: boolean;
  dark?: boolean;
  children?: ReactNode;
};

/** Two-column section: heading and copy on one side, a tall parallax photo on the other. */
export function ImageSplit({ id, label, index, title, accent, paragraphs, photo, reverse, dark, children }: Props) {
  return (
    <section aria-labelledby={id} className={dark ? "bg-ink text-paper" : "bg-paper text-ink"}>
      <div className="container-x grid items-center gap-12 py-24 md:py-36 lg:grid-cols-12 lg:gap-16">
        <div className={`lg:col-span-6 ${reverse ? "lg:order-2 lg:col-start-7" : ""}`}>
          <SectionLabel index={index} className={dark ? "text-mint" : "text-brand"}>
            {label}
          </SectionLabel>
          <SplitReveal
            id={id}
            text={title}
            accent={accent}
            className={`display mt-8 type-h2 text-balance ${dark ? "[&_.accent]:text-mint" : "[&_.accent]:text-brand"}`}
          />
          <Reveal stagger={0.1} className="mt-10 space-y-5">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 32)} className={`max-w-xl text-base leading-relaxed md:text-lg ${dark ? "text-paper/65" : "text-ink/70"}`}>
                {p}
              </p>
            ))}
          </Reveal>
          {children}
        </div>
        <Reveal className={`lg:col-span-6 ${reverse ? "lg:order-1" : "lg:col-start-7"}`}>
          <ParallaxImage photo={photo} sizes="(min-width: 1024px) 46vw, 100vw" className="aspect-[4/5] rounded-[2rem] md:aspect-[5/4] lg:aspect-[4/5]" />
        </Reveal>
      </div>
    </section>
  );
}
