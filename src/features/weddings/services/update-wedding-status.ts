import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";

export async function updateWeddingStatus(
  weddingId: string,
  status: "PUBLISHED" | "COMPLETED",
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

  if (
    wedding.status === "DRAFT" &&
    status !== "PUBLISHED"
  ) {
    throw new Error("Una boda en borrador solo puede publicarse");
  }

  if (
    wedding.status === "PUBLISHED" &&
    status !== "COMPLETED"
  ) {
    throw new Error("Una boda publicada solo puede completarse");
  }

  if (wedding.status === "COMPLETED") {
    throw new Error("Una boda completada no puede cambiar de estado");
  }

  return prisma.wedding.update({
    where: {
      id: weddingId,
    },
    data: {
      status,
    },
  });
}