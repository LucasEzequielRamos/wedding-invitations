import { prisma } from "@/lib/db/prisma";

export async function getPublicMedia(
  slug: string,
) {
  const wedding = await prisma.wedding.findFirst({
    where: {
      slug,
      status: {
        in: ["PUBLISHED", "COMPLETED"],
      },
    },
    select: {
      media: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
        select: {
          id: true,
          path: true,
          type: true,
          alt: true,
          sortOrder: true,
        },
      },
    },
  });

  if (!wedding) {
    throw new Error(
      "Invitación no encontrada",
    );
  }

  return wedding.media;
}