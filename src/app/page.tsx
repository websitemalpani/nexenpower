import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Services } from "@/components/home/Services";
import { Marquee } from "@/components/home/Marquee";
import { Approach } from "@/components/home/Approach";
import { Operations } from "@/components/home/Operations";
import { Partnerships } from "@/components/home/Partnerships";
import { PhotoBand } from "@/components/shared/PhotoBand";
import { Journey } from "@/components/shared/Journey";
import { Board } from "@/components/shared/Board";
import { CallToAction } from "@/components/shared/CallToAction";
import { operations, photos } from "@/content/pages";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Services />
      <PhotoBand photo={photos.grid}title="Investing in hybrid and battery storage for a firmer, cleaner grid." />
      <Marquee />
      <Approach />
      <Operations />
      <PhotoBand photo={operations.spotlight.image} title={operations.spotlight.title} text={operations.spotlight.text} />
      <Journey index="05" />
      <Partnerships />
      <Board index="07" compact />
      <CallToAction />
    </>
  );
}
