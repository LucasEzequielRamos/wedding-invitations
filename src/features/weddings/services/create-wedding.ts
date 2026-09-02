import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import {
  createWeddingSchema,
  type CreateWeddingInput,
} from "../schemas/wedding.schema";

export async function createWedding(input: CreateWeddingInput) {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    throw new Error("No autenticado");
  }

  const data = createWeddingSchema.parse(input);

  const existingSlug = await prisma.wedding.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (existingSlug) {
    throw new Error("El slug ya está en uso");
  }

  return prisma.wedding.create({
    data: {
      name: data.name,
      slug: data.slug,
      weddingDate: data.weddingDate,
      plan: data.plan,
      status: "DRAFT",

      members: {
        create: {
          userId: authUser.id,
          role: "OWNER",
        },
      },
    },

    include: {
      members: true,
    },
  });
}