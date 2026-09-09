import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import { z } from "zod";

const weddingIdSchema = z.string().uuid();

export async function getWeddingMedia(
  weddingId: string,
) {
  const parsed = weddingIdSchema.safeParse(
    weddingId,
  );

  if (!parsed.success) {
    throw new Error("ID de boda inválido");
  }

  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    throw new Error("No autenticado");
  }

  const wedding = await prisma.wedding.findFirst({
    where: {
      id: parsed.data,
      members: {
        some: {
          userId: authUser.id,
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!wedding) {
    throw new Error("Boda no encontrada");
  }

  return prisma.media.findMany({
    where: {
      weddingId: parsed.data,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });
}