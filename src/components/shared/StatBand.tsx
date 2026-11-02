import { stats } from "@/content/site";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";

/** The headline portfolio numbers as a light band. */
export function StatBand() {
  return (
    <section aria-label="Portfolio at a glance" className="bg-paper text-ink">
      <Reveal stagger={0.1} as="dl" className="container-x grid gap-10 py-16 sm:grid-cols-3 md:py-24">
        {stats.map((s) => (
          <div key={s.label} className="border-t border-ink/15 pt-6 sm:pr-8">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <p className="display flex items-baseline gap-2 type-h1">
                <Counter value={s.value} suffix={s.suffix} />
                <span className="text-[0.4em] font-medium tracking-tight text-brand">{s.unit}</span>
              </p>
              <p aria-hidden className="mt-2 text-ink/60">
                {s.label}
              </p>
            </dd>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
