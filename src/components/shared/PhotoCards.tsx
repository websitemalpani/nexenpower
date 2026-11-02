import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/content/pages";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Button";

export type PhotoCard = { href: string; title: string; text: string; photo: Photo; meta?: string };

type Props = {
  id: string;
  label: string;
  index?: string;
  title: string;
  accent?: string[];
  cards: readonly PhotoCard[];
  dark?: boolean;
};

/** Linked image cards — related services, articles, next steps. */
export function PhotoCards({ id, label, index, title, accent, cards, dark }: Props) {
  const cols = cards.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <section aria-labelledby={id} className={dark ? "bg-ink text-paper" : "bg-paper text-ink"}>
      <div className="container-x py-24 md:py-36">
        <SectionLabel index={index} className={dark ? "text-mint" : "text-brand"}>
          {label}
        </SectionLabel>
        <SplitReveal
          id={id}
          text={title}
          accent={accent}
          className={`display mt-8 max-w-[20ch] type-h2 ${dark ? "[&_.accent]:text-mint" : "[&_.accent]:text-brand"}`}
        />
        <Reveal stagger={0.1} as="ul" className={`mt-16 grid gap-6 md:mt-20 md:grid-cols-2 ${cols}`}>
          {cards.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
                  <Image
                    src={c.photo.src}
                    alt={c.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 100vw"
                    className="object-cover transition-transform duration-[1.4s] ease-(--ease-expo) group-hover:scale-105"
                  />
                  <span className="absolute right-4 bottom-4 flex size-12 items-center justify-center rounded-full bg-paper text-ink transition-colors duration-500 group-hover:bg-mint">
                    <Arrow className="-rotate-45 transition-transform duration-500 group-hover:rotate-0" />
                  </span>
                </div>
                {c.meta && <p className={`eyebrow mt-6 ${dark ? "text-mint" : "text-brand"}`}>{c.meta}</p>}
                <h3 className={`text-2xl font-semibold tracking-tight text-balance ${c.meta ? "mt-3" : "mt-6"}`}>{c.title}</h3>
                <p className={`mt-3 leading-relaxed ${dark ? "text-paper/60" : "text-ink/65"}`}>{c.text}</p>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
