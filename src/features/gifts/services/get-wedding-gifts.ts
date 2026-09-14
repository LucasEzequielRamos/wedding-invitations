import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";


export async function getWeddingGifts(
  weddingId: string,
) {
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
  });

  if (!wedding) {
    throw new Error("Boda no encontrada");
  }

  if (wedding.plan !== "FULL") {
    throw new Error(
      "Esta boda no tiene regalos habilitados",
    );
  }

  return prisma.gift.findMany({
    where: {
      weddingId,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
}