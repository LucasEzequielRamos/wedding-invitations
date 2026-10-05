import Image from "next/image";

import { getPublicMediaUrl } from "@/features/media/utils/get-public-media-url";

type GalleryMedia = {
  id: string;
  path: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

type Props = {
  media: GalleryMedia[];
};

export function GalleryBotanicalEditorial({ media }: Props) {
  if (!media.length) {
    return null;
  }

  return (
    <section className="bg-[#FDF6DC] px-6 py-16 text-[#283517]">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {media.map(item => (
            <div key={item.id} className="relative overflow-hidden">
              <Image
                src={getPublicMediaUrl(item.path)}
                alt={item.alt ?? ""}
                width={item.width ?? 800}
                height={item.height ?? 800}
                sizes="(max-width: 768px) 50vw, 33vw"
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
