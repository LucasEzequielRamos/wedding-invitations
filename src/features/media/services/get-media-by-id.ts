import { prisma } from "@/lib/db/prisma";

export async function getMediaById(
  weddingId: string,
  mediaId: string,
) {
  return prisma.media.findFirst({
    where: {
      id: mediaId,
      weddingId,
    },
    select: {
      id: true,
      path: true,
      type: true,
      alt: true,
      mimeType: true,
      width: true,
      height: true,
    },
  });
}