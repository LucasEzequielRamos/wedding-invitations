import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";

export async function getWeddingConfig(weddingId: string) {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    throw new Error("No autenticado");
  }

  const wedding = await prisma.wedding.findFirst({
    where: {
      id: weddingId,
      members: {
        some: {
          userId: authUser.id,
        },
      },
    },
    select: {
      id: true,
      plan: true,
      status: true,
      weddingDate: true,
      rsvpEnabled: true,
      rsvpDeadline: true,
      giftsEnabled: true,
    },
  });

  if (!wedding) {
    throw new Error("Boda no encontrada");
  }

  return wedding;
}