import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  id: string;
  label: string;
  index?: string;
  title: string;
  accent?: string[];
  items: readonly { title: string; text: string }[];
  dark?: boolean;
};

/** Numbered card grid for capabilities, partner types, focus areas. */
export function FeatureGrid({ id, label, index, title, accent, items, dark }: Props) {
  const cols = items.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <section aria-labelledby={id} className={dark ? "bg-ink text-paper" : "bg-sand text-ink"}>
      <div className="container-x py-24 md:py-36">
        <div className="grid gap-8 md:grid-cols-12">
          <SectionLabel index={index} className={`md:col-span-3 ${dark ? "text-mint" : "text-brand"}`}>
            {label}
          </SectionLabel>
          <SplitReveal
            id={id}
            text={title}
            accent={accent}
            className={`display type-h2 text-balance md:col-span-9 ${dark ? "[&_.accent]:text-mint" : "[&_.accent]:text-brand"}`}
          />
        </div>
        <Reveal stagger={0.08} as="ul" className={`mt-16 grid gap-3 sm:grid-cols-2 md:mt-24 ${cols}`}>
          {items.map((item, i) => (
            <li
              key={item.title}
              className={`group relative overflow-hidden rounded-3xl p-8 transition-colors duration-700 md:p-10 ${
                dark ? "border border-paper/10 bg-night hover:bg-forest" : "bg-paper hover:bg-ink hover:text-paper"
              }`}
            >
              <span className={`font-mono text-xs ${dark ? "text-mint" : "text-brand group-hover:text-mint"}`}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-12 text-2xl font-semibold tracking-tight md:mt-16">{item.title}</h3>
              <p className={`mt-3 leading-relaxed transition-colors duration-700 ${dark ? "text-paper/60" : "text-ink/65 group-hover:text-paper/65"}`}>{item.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
