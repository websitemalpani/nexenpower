import type { Metadata } from "next";
import { about } from "@/content/site";
import { photos, sustainability } from "@/content/pages";
import { PageHero } from "@/components/shared/PageHero";
import { BrandMarkStage } from "@/components/about/BrandMarkStage";
import { VisionMission } from "@/components/about/VisionMission";
import { Story } from "@/components/about/Story";
import { Values } from "@/components/about/Values";
import { Sustainability } from "@/components/about/Sustainability";
import { PhotoBand } from "@/components/shared/PhotoBand";
import { ImageSplit } from "@/components/shared/ImageSplit";
import { Journey } from "@/components/shared/Journey";
import { Board } from "@/components/shared/Board";
import { CallToAction } from "@/components/shared/CallToAction";

export const metadata: Metadata = {
  title: "About",
  description:
    "From the century-old Malpani Group to an independent power producer: NEXEN POWER’s story, vision, mission, values, sustainability commitments and board of directors.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero label={about.label} title={about.title} accent={["Renewable", "Energy", "Future"]} lead={about.storyLead} visual={<BrandMarkStage />} />
      <VisionMission />
      <Story />
      <PhotoBand photo={photos.windHills} title="Every megawatt we operate is clean power India doesn’t have to burn for." />
      <Values />
      <Sustainability index="04" />
      <ImageSplit
        id="about-commitment"
        index="05"
        label="Long-term thinking"
        title={sustainability.commitmentTitle}
        accent={["decades,"]}
        paragraphs={sustainability.commitment}
        photo={sustainability.commitmentImage}
        dark
      />
      <Journey index="06" />
      <Board index="07" />
      <CallToAction />
    </>
  );
}
