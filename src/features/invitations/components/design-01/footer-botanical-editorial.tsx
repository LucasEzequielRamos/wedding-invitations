import Image from "next/image";

import { getPublicMediaUrl } from "@/features/media/utils/get-public-media-url";
import type { FooterConfig } from "../../schemas/footer.schema";

type FooterMedia = {
  path: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

type Props = {
  config: FooterConfig;
  media: FooterMedia | null;
};

export function FooterBotanicalEditorial({ config, media }: Props) {
  return (
    <footer className="bg-[#FDF6DC] px-6 py-20 text-[#283517]">
      <div className="mx-auto flex min-h-[300px] max-w-[1200px] flex-col items-center justify-center">
        <p className="font-['la_belle_aurore'] text-4xl sm:text-5xl">
          {config.title}
        </p>

        {media && (
          <div className="mt-8">
            <Image
              src={getPublicMediaUrl(media.path)}
              alt={media.alt ?? ""}
              width={media.width ?? 300}
              height={media.height ?? 300}
              className="h-24 w-24 object-contain"
            />
          </div>
        )}
      </div>
    </footer>
  );
}
