import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import {
  weddingConfigSchema,
  type WeddingConfigInput,
} from "../schemas/wedding-config.schema";

export async function updateWeddingConfig(
  weddingId: string,
  input: WeddingConfigInput,
) {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    throw new Error("No autenticado");
  }

  const parsed = weddingConfigSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Configuración inválida");
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

  if (wedding.status === "COMPLETED") {
    throw new Error("La boda está completada");
  }

  if (!wedding.weddingDate) {
    throw new Error(
      "La boda no tiene una fecha configurada",
    );
  }

  if (parsed.data.rsvpDeadline) {
    if (parsed.data.rsvpDeadline >= wedding.weddingDate) {
      throw new Error(
        "La fecha límite de RSVP debe ser anterior a la boda",
      );
    }
  }

  return prisma.wedding.update({
    where: {
      id: weddingId,
    },
    data: parsed.data,
  });
}