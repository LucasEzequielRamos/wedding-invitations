import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";

export async function deleteGuest(
  guestId: string,
) {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    throw new Error("No autenticado");
  }

  const guest = await prisma.guest.findFirst({
    where: {
      id: guestId,
      wedding: {
        members: {
          some: {
            userId: authUser.id,
          },
        },
      },
    },
  });

  if (!guest) {
    throw new Error("Invitado no encontrado");
  }

  return prisma.guest.delete({
    where: {
      id: guestId,
    },
  });
}