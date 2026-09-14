import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import {
  createGuestSchema,
  type CreateGuestInput,
} from "../schemas/guest.schema";

export async function createGuest(
  input: CreateGuestInput,
) {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    throw new Error("No autenticado");
  }

  const data = createGuestSchema.parse(input);

  const wedding = await prisma.wedding.findFirst({
    where: {
      id: data.weddingId,
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

  if (data.groupId) {
    const group = await prisma.guestGroup.findFirst({
      where: {
        id: data.groupId,
        weddingId: data.weddingId,
      },
    });

    if (!group) {
      throw new Error("Grupo familiar inválido");
    }
  }

  return prisma.guest.create({
    data: {
      weddingId: data.weddingId,
      groupId: data.groupId ?? null,
      firstName: data.firstName,
      lastName: data.lastName,
    },
  });
}