
import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";

export async function deleteGuest(
  weddingId: string,
  guestId: string,
) {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    throw new Error("No autenticado");
  }

  const guest = await prisma.guest.findFirst({
    where: {
      id: guestId,
      weddingId,
      wedding: {
        members: {
          some: {
            userId: authUser.id,
          },
        },
      },
    },
    select: {
      id: true,
      wedding: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!guest) {
    throw new Error("Invitado no encontrado");
  }

  if (guest.wedding.status === "COMPLETED") {
    throw new Error(
      "No se pueden eliminar invitados de una boda completada",
    );
  }

  return prisma.guest.delete({
    where: {
      id: guest.id,
    },
  });
}
