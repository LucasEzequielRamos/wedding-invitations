import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import {
  updateGuestSchema,
  type UpdateGuestInput,
} from "../schemas/guest.schema";

export async function updateGuest(
  guestId: string,
  input: UpdateGuestInput,
) {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    throw new Error("No autenticado");
  }

  const data = updateGuestSchema.parse(input);

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

  if (data.groupId) {
    const group = await prisma.guestGroup.findFirst({
      where: {
        id: data.groupId,
        weddingId: guest.weddingId,
      },
    });

    if (!group) {
      throw new Error("Grupo inválido");
    }
  }

  return prisma.guest.update({
    where: {
      id: guestId,
    },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      groupId: data.groupId ?? null,
    },
  });
}