import { prisma } from "@/lib/db/prisma";

export async function getWeddingEvents(weddingId: string) {
  return prisma.event.findMany({
    where: {
      weddingId,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        date: "asc",
      },
    ],
  });
}