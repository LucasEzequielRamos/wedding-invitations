import { prisma } from "@/lib/db/prisma";

export async function getPublicGifts(slug: string) {
  const wedding = await prisma.wedding.findFirst({
    where: {
      slug,
      plan: "FULL",
      status: {
        in: ["PUBLISHED", "COMPLETED"],
      },
      giftsEnabled: true,
    },
    select: {
      id: true,
      gifts: {
        where: {
          isVisible: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          externalUrl: true,
          paymentUrl: true,
          sortOrder: true,
        },
      },
    },
  });

  if (!wedding) {
    throw new Error("Invitación no encontrada");
  }

  return wedding.gifts;
}