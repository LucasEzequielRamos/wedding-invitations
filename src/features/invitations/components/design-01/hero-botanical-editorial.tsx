import Image from "next/image";
import { getPublicMediaUrl } from "@/features/media/utils/get-public-media-url";
import type { HeroConfig } from "../../schemas/hero.schema";

type HeroMedia = {
  path: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

type Props = {
  config: HeroConfig;
  media: HeroMedia | null;
};

export function HeroBotanicalEditorial({ config, media }: Props) {
  return (
    <section className="relative overflow-hidden bg-[#FDF6DC] text-[#283517]">
      {media && (
        <div className="relative w-full">
          <Image
            src={getPublicMediaUrl(media.path)}
            alt={media.alt ?? ""}
            width={media.width ?? 1600}
            height={media.height ?? 1200}
            priority
            sizes="100vw"
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      <div className="mx-auto flex min-h-[70svh] max-w-[1200px] flex-col items-center justify-center px-6 py-16 text-center">
        {config.subtitle && (
          <p className="mb-4 text-sm uppercase tracking-[0.25em]">
            {config.subtitle}
          </p>
        )}

        {config.title && (
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            {config.title}
          </h1>
        )}

        {config.showDate && config.date && (
          <p className="mt-6 text-lg tracking-wide">{config.date}</p>
        )}
      </div>
    </section>
  );
}
