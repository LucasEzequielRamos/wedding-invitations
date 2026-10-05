import Image from "next/image";

import { getPublicMediaUrl } from "@/features/media/utils/get-public-media-url";
import type { CustomConfig } from "../schemas/custom-config.schema";

type MediaItem = {
  id: string;
  path: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

type Props = {
  config: CustomConfig;
  media: MediaItem[];
};

export function InvitationCustom({ config, media }: Props) {
  const getMedia = (key: string) => {
    const id = config.media[key];

    return media.find(item => item.id === id) ?? null;
  };

  switch (config.variant) {
    case "romantic-floral": {
      const top = getMedia("top");
      const bottom = getMedia("bottom");

      return (
        <section className="w-full overflow-hidden">
          {top && (
            <div className="w-full">
              <Image
                src={getPublicMediaUrl(top.path)}
                alt={top.alt ?? ""}
                width={top.width ?? 1200}
                height={top.height ?? 800}
                sizes="100vw"
                className="h-auto w-full object-contain"
              />
            </div>
          )}

          {bottom && (
            <div className="w-full">
              <Image
                src={getPublicMediaUrl(bottom.path)}
                alt={bottom.alt ?? ""}
                width={bottom.width ?? 1200}
                height={bottom.height ?? 800}
                sizes="100vw"
                className="h-auto w-full object-contain"
              />
            </div>
          )}
        </section>
      );
    }

    default:
      return null;
  }
}
