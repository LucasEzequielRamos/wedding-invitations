import Image from "next/image";
import { getPublicMediaUrl } from "@/features/media/utils/get-public-media-url";
import { IllustrationConfig } from "../schemas/illustration-config.schema";

type IllustrationMedia = {
  id: string;
  path: string;
  type: string;
  alt: string | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
};

type Props = {
  config: IllustrationConfig;
  media: IllustrationMedia | null;
};

export function InvitationIllustration({ config, media }: Props) {
  const data: IllustrationConfig = config;

  if (!media) {
    return null;
  }

  return (
    <section className="w-full">
      <Image
        src={getPublicMediaUrl(media.path)}
        alt={data.alt ?? media.alt ?? ""}
        width={media.width ?? 1200}
        height={media.height ?? 800}
        sizes="100vw"
        className="h-auto w-full"
      />
    </section>
  );
}
