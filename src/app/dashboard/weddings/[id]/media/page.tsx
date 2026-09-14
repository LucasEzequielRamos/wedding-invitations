import { getWeddingMedia } from "@/features/media/services/get-wedding-media";
import { MediaManager } from "@/features/media/components/media-manager";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MediaPage({ params }: Props) {
  const { id } = await params;

  const media = await getWeddingMedia(id);

  return <MediaManager weddingId={id} initialMedia={media} />;
}
