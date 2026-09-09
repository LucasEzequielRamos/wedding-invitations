import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import {
  giftSchema,
  type GiftInput,
} from "../schemas/gift.schema";

export async function updateGift(
  weddingId: string,
  giftId: string,
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

  const gift = await prisma.gift.findFirst({
    where: {
      id: giftId,
      weddingId,
    },
  });

  if (!gift) {
    throw new Error("Regalo no encontrado");
  }

  const data = giftSchema.parse(input);

  return prisma.gift.update({
  where: {
    id: giftId,
  },
  data: {
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