import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import {
  rsvpQuestionSchema,
  type RsvpQuestionInput,
} from "../schemas/rsvp-question.schema";

export async function updateRsvpQuestion(
  weddingId: string,
  questionId: string,
  input: RsvpQuestionInput,
) {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    throw new Error("No autenticado");
  }

  const data = rsvpQuestionSchema.parse(input);

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

  return prisma.rsvpQuestion.update({
    where: {
      id: questionId,
    },
    data: {
      question: data.question,
      type: data.type,
      required: data.required,
      options: data.options ?? undefined,
      sortOrder: data.sortOrder,
    },
  });
}