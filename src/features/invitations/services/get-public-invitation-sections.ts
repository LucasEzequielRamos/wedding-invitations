import { prisma } from "@/lib/db/prisma";

export async function getPublicInvitationSections(
  weddingId: string,
) {
  return prisma.invitationSection.findMany({
    where: {
      weddingId,
      enabled: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
    select: {
      id: true,
      type: true,
      sortOrder: true,
      config: true,
    },
  });
}