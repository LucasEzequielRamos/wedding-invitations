import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";

export async function deleteEvent(
  weddingId: string,
  eventId: string,
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

  if (wedding.status === "COMPLETED") {
    throw new Error("La boda está completada");
  }

  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      weddingId,
    },
  });

  if (!event) {
    throw new Error("Evento no encontrado");
  }

  await prisma.event.delete({
    where: {
      id: eventId,
    },
  });

  return { success: true };
}