import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import {
  giftSchema,
  type GiftInput,
} from "../schemas/gift.schema";

export async function createGift(
  weddingId: string,
  input: GiftInput,
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

  if (wedding.plan !== "FULL") {
    throw new Error(
      "Esta boda no tiene regalos habilitados",
    );
  }

  if (wedding.status === "COMPLETED") {
    throw new Error("La boda está completada");
  }

  const data = giftSchema.parse(input);

 return prisma.gift.create({
  data: {
    weddingId,
    name: data.name,
    description: data.description || null,
    image: data.image || null,
    externalUrl: data.externalUrl || null,
    paymentUrl: data.paymentUrl || null,
    sortOrder: data.sortOrder,
    isVisible: data.isVisible,
  },
});
}