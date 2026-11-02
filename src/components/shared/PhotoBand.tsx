import type { Photo } from "@/content/pages";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Reveal } from "@/components/ui/Reveal";

/** Full-bleed photograph with an optional statement laid over the lower edge. */
export function PhotoBand({ photo, title, text }: { photo: Photo; title?: string; text?: string }) {
  return (
    <section aria-label={title ?? photo.alt} className="relative bg-ink text-paper">
      <ParallaxImage photo={photo} sizes="100vw" amount={12} className="h-[70svh] min-h-[420px] md:h-[85svh]" />
      {title && (
        <div className="absolute inset-0 flex items-end bg-[linear-gradient(180deg,transparent_35%,rgba(4,18,13,.9)_100%)]">
          <Reveal className="container-x pb-14 md:pb-20">
            <h2 className="display max-w-[18ch] type-h2">{title}</h2>
            {text && <p className="mt-6 max-w-xl text-paper/70 md:text-lg">{text}</p>}
          </Reveal>
        </div>
      )}
    </section>
  );
}
