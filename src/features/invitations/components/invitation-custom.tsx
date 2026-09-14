import Image from "next/image";
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function getPublicMediaUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/wedding-media/${path}`;
}

export function InvitationCustom({ config, media }: Props) {
  const data =
    config && typeof config === "object"
      ? (config as {
          variant?: string;
          media?: Record<string, string>;
        })
      : {};

  const getMedia = (key: string) => {
    const id = config.media[key];

    return media.find(item => item.id === id) ?? null;
  };

  switch (data.variant) {
    case "romantic-floral": {
      const top = getMedia("top");
      const bottom = getMedia("bottom");

      return (
        <section className="relative py-20">
          {top && (
            <Image
              src={getPublicMediaUrl(top.path)}
              alt={top.alt ?? ""}
              width={top.width ?? 1200}
              height={top.height ?? 800}
              className="mx-auto max-w-full"
            />
          )}

          <p className="text-center">Romantic Floral</p>

          {bottom && (
            <Image
              src={getPublicMediaUrl(bottom.path)}
              alt={bottom.alt ?? ""}
              width={bottom.width ?? 1200}
              height={bottom.height ?? 800}
              className="mx-auto max-w-full"
            />
          )}
        </section>
      );
    }

    default:
      return null;
  }
}
