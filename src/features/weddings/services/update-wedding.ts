import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import {
  updateWeddingSchema,
  type UpdateWeddingInput,
} from "../schemas/wedding.schema";

export async function updateWedding(
  weddingId: string,
  input: UpdateWeddingInput,
) {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    throw new Error("No autenticado");
  }

  const data = updateWeddingSchema.parse(input);

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

  const slugOwner = await prisma.wedding.findFirst({
    where: {
      slug: data.slug,
      NOT: {
        id: weddingId,
      },
    },
  });

  if (slugOwner) {
    throw new Error("El slug ya está en uso");
  }

  return prisma.wedding.update({
    where: {
      id: weddingId,
    },

    data: {
      name: data.name,
      slug: data.slug,
      weddingDate: data.weddingDate,
      plan: data.plan,
    },
  });
}