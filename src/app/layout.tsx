import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { BackToTopFloating } from "@/components/ui/BackToTop";

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Powering India’s Renewable Energy Transformation`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "NEXEN POWER",
    "Independent Power Producer",
    "IPP India",
    "renewable energy India",
    "solar power developer",
    "wind energy operations",
    "hybrid renewable projects",
    "battery energy storage BESS",
    "Malpani Group",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    url: "/",
    title: `${site.name} — Powering India’s Renewable Energy Transformation`,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04120d",
  colorScheme: "light",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/images/brand/nexen-logo.webp`,
  description: site.description,
  email: site.contact.email,
  telephone: site.contact.phones.map((p) => `+91 ${p}`),
  address: {
    "@type": "PostalAddress",
    streetAddress: "4th Floor, Scorpio House, Central Avenue Road, Hiranandani Gardens, Powai",
    addressLocality: "Mumbai",
    postalCode: "400076",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  parentOrganization: { "@type": "Organization", name: "Malpani Group" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        {/* Flag JS early so reveal targets start hidden without a flash. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <noscript>
          <style>{".preloader{display:none!important}"}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body>
        <a
          href="#main"
          className="fixed top-3 left-3 z-[200] -translate-y-24 rounded-full bg-mint px-5 py-3 text-sm font-medium text-ink focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Preloader />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <BackToTopFloating />
        </SmoothScroll>
      </body>
    </html>
  );
}
