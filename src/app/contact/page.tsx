import type { Metadata } from "next";
import { contactCopy, site, telHref } from "@/content/site";
import { photos } from "@/content/pages";
import { PageHero } from "@/components/shared/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Partner with NEXEN POWER. Reach our Mumbai head office for partnerships, investment collaborations and renewable energy business opportunities.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero label={contactCopy.label} title={contactCopy.pageTitle} accent={["Clean", "Energy"]} lead={contactCopy.text} image={photos.windHorizon} />

      <section aria-label="Contact details and form" className="bg-paper text-ink">
        <div className="container-x grid gap-16 py-24 md:py-32 lg:grid-cols-12">
          <Reveal stagger={0.1} className="space-y-12 lg:col-span-4">
            <div>
              <SectionLabel className="text-brand">Head office</SectionLabel>
              <address className="mt-5 text-xl leading-snug not-italic">
                {site.contact.address.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              <a
                href={site.contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand underline-offset-4 hover:underline"
              >
                Open in Google Maps
                <span aria-hidden>↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
            <div>
              <SectionLabel className="text-brand">Email</SectionLabel>
              <a href={`mailto:${site.contact.email}`} className="mt-5 block text-2xl font-medium tracking-tight transition-colors hover:text-brand md:text-3xl">
                {site.contact.email}
              </a>
            </div>
            <div>
              <SectionLabel className="text-brand">Phone</SectionLabel>
              <ul className="mt-5 space-y-2 text-xl">
                {site.contact.phones.map((p) => (
                  <li key={p}>
                    <a href={telHref(p)} className="transition-colors hover:text-brand">
                      {p}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal className="rounded-[2rem] bg-white/60 p-6 ring-1 ring-ink/5 md:p-12 lg:col-span-7 lg:col-start-6">
            <h2 className="mb-10 text-3xl font-semibold tracking-tight md:text-4xl">Send us a message</h2>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
