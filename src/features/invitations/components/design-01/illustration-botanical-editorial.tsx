import Image from "next/image";

import { getPublicMediaUrl } from "@/features/media/utils/get-public-media-url";
import type { IllustrationConfig } from "../../schemas/illustration-config.schema";

type IllustrationMedia = {
  id: string;
  path: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

type Props = {
  config: IllustrationConfig;
  media: IllustrationMedia | null;
};

export function IllustrationBotanicalEditorial({ config, media }: Props) {
  if (!media) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden bg-[#FDF6DC] px-6 py-8">
      <div className="mx-auto flex max-w-[1200px] justify-center">
        <Image
          src={getPublicMediaUrl(media.path)}
          alt={config.alt ?? media.alt ?? ""}
          width={media.width ?? 1200}
          height={media.height ?? 800}
          sizes="(max-width: 768px) 100vw, 1200px"
          className="h-auto max-w-full object-contain"
        />
      </div>
    </section>
  );
}
