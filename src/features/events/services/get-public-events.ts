import { prisma } from "@/lib/db/prisma";

export async function getPublicEvents(
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
      events: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            date: "asc",
          },
        ],
        select: {
          id: true,
          name: true,
          date: true,
          time: true,
          location: true,
          address: true,
          mapsUrl: true,
          sortOrder: true,
        },
      },
    },
  });

  if (!wedding) {
    throw new Error("Invitación no encontrada");
  }

  return wedding.events;
}