import Image from "next/image";

import { getPublicMediaUrl } from "@/features/media/utils/get-public-media-url";
import type { HeroConfig } from "../schemas/hero.schema";
import { HeroBotanicalEditorial } from "./design-01/hero-botanical-editorial";

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

export function InvitationHero({ config, media }: Props) {
  switch (config.variant) {
    case "botanical-editorial":
      return <HeroBotanicalEditorial config={config} media={media} />;

    default:
      return (
        <section className="relative w-full overflow-hidden">
          {media && (
            <Image
              src={getPublicMediaUrl(media.path)}
              alt={media.alt ?? ""}
              width={media.width ?? 1600}
              height={media.height ?? 1200}
              priority
              sizes="100vw"
              className="h-auto w-full object-cover"
            />
          )}

          <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-7xl flex-col items-center justify-center px-6 py-16 text-center">
            {config.subtitle && (
              <p className="mb-4 text-sm">{config.subtitle}</p>
            )}

            {config.title && (
              <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                {config.title}
              </h1>
            )}

            {config.showDate && config.date && (
              <p className="mt-6 text-lg">{config.date}</p>
            )}
          </div>
        </section>
      );
  }
}
