
import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import {
  updateGuestSchema,
  type UpdateGuestInput,
} from "../schemas/guest.schema";

export async function updateGuest(
  weddingId: string,
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
      weddingId: true,
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
      "No se pueden editar invitados de una boda completada",
    );
  }

  const groupId = data.groupId ?? null;

  if (groupId) {
    const group = await prisma.guestGroup.findFirst({
      where: {
        id: groupId,
        weddingId: guest.weddingId,
      },
      select: {
        id: true,
      },
    });

    if (!group) {
      throw new Error("El grupo seleccionado no es válido");
    }
  }

  return prisma.guest.update({
    where: {
      id: guest.id,
    },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      groupId,
    },
    include: {
      group: true,
      rsvp: true,
    },
  });
}
