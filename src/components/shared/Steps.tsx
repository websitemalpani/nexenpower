import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  id: string;
  label: string;
  index?: string;
  title: string;
  accent?: string[];
  steps: readonly { title: string; text: string }[];
};

/** Horizontal process line — stacks on small screens. */
export function Steps({ id, label, index, title, accent, steps }: Props) {
  return (
    <section aria-labelledby={id} className="bg-paper text-ink">
      <div className="container-x py-24 md:py-36">
        <SectionLabel index={index} className="text-brand">
          {label}
        </SectionLabel>
        <SplitReveal id={id} text={title} accent={accent} className="display mt-8 max-w-[18ch] type-h2 [&_.accent]:text-brand" />
        <Reveal stagger={0.1} as="ol" className="mt-16 grid gap-10 md:mt-24 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((s, i) => (
            <li key={s.title} className="relative border-t border-ink/15 pt-8">
              <span aria-hidden className="absolute -top-[5px] left-0 size-[9px] rounded-full bg-brand" />
              <span className="font-mono text-xs text-ink/40">Step {String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 max-w-xs leading-relaxed text-ink/65">{s.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
