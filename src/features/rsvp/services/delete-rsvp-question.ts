import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";

export async function deleteRsvpQuestion(
  weddingId: string,
  questionId: string,
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
    throw new Error("Esta boda no tiene RSVP habilitado");
  }

  if (wedding.status === "COMPLETED") {
    throw new Error("La boda está completada");
  }

  const question = await prisma.rsvpQuestion.findFirst({
    where: {
      id: questionId,
      weddingId,
    },
  });

  if (!question) {
    throw new Error("Pregunta no encontrada");
  }

  return prisma.rsvpQuestion.delete({
    where: {
      id: questionId,
    },
  });
}