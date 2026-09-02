import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import {
  createGuestGroupSchema,
  type CreateGuestGroupInput,
} from "../schemas/guest.schema";

export async function createGuestGroup(
  input: CreateGuestGroupInput,
) {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    throw new Error("No autenticado");
  }

  const data = createGuestGroupSchema.parse(input);

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

  return prisma.guestGroup.create({
    data: {
      weddingId: data.weddingId,
      name: data.name,
    },
  });
}