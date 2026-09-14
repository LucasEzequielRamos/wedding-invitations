import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@/generated/prisma/client";
import {
  submitRsvpSchema,
  type SubmitRsvpInput,
} from "../schemas/submit-rsvp.schema";

function validateAnswer(
  question: {
    id: string;
    type: "TEXT" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "BOOLEAN";
    required: boolean;
    options: unknown;
  },
  answer: unknown,
) {
  if (
    answer === null ||
    answer === undefined ||
    answer === ""
  ) {
    if (question.required) {
      throw new Error(
        `La pregunta "${question.id}" es obligatoria`,
      );
    }

    return;
  }

  switch (question.type) {
    case "TEXT":
      if (typeof answer !== "string") {
        throw new Error("La respuesta debe ser texto");
      }
      break;

    case "BOOLEAN":
      if (typeof answer !== "boolean") {
        throw new Error(
          "La respuesta debe ser verdadera o falsa",
        );
      }
      break;

    case "SINGLE_CHOICE": {
      if (typeof answer !== "string") {
        throw new Error(
          "La respuesta seleccionada no es válida",
        );
      }

      if (!Array.isArray(question.options)) {
        throw new Error(
          "La pregunta no tiene opciones configuradas",
        );
      }

      if (!question.options.includes(answer)) {
        throw new Error(
          "La opción seleccionada no es válida",
        );
      }

      break;
    }

    case "MULTIPLE_CHOICE": {
      if (!Array.isArray(answer)) {
        throw new Error(
          "La respuesta debe ser una lista de opciones",
        );
      }

      if (!Array.isArray(question.options)) {
        throw new Error(
          "La pregunta no tiene opciones configuradas",
        );
      }

      for (const selectedOption of answer) {
        if (
          typeof selectedOption !== "string" ||
          !question.options.includes(selectedOption)
        ) {
          throw new Error(
            "Una de las opciones seleccionadas no es válida",
          );
        }
      }

      break;
    }
  }
}

export async function submitPublicRsvp(
  input: SubmitRsvpInput,
) {
  const data = submitRsvpSchema.parse(input);

  const wedding = await prisma.wedding.findUnique({
    where: {
      id: data.weddingId,
    },
    select: {
      id: true,
      status: true,
      plan: true,
      rsvpEnabled: true,
  rsvpDeadline: true,
      rsvpQuestions: {
        select: {
          id: true,
          type: true,
          required: true,
          options: true,
        },
      },
    },
  });

  if (!wedding) {
    throw new Error("Boda no encontrada");
  }

  if (wedding.plan !== "FULL") {
    throw new Error(
      "Esta boda no tiene RSVP habilitado",
    );
  }

  if (wedding.status !== "PUBLISHED") {
    throw new Error("El RSVP no está disponible");
  }

  if (!wedding.rsvpEnabled) {
  throw new Error("El RSVP está cerrado");
  }

  if (
  wedding.rsvpDeadline &&
  new Date() > wedding.rsvpDeadline
  ) {
  throw new Error("El RSVP está cerrado");
  }

  const guest = await prisma.guest.findFirst({
    where: {
      id: data.guestId,
      weddingId: data.weddingId,
    },
    select: {
      id: true,
    },
  });

  if (!guest) {
    throw new Error("Invitado no encontrado");
  }

  /*
   * Convertimos las preguntas en un Map para poder
   * validar rápidamente cada questionId recibido.
   */
  const questionMap = new Map(
    wedding.rsvpQuestions.map((question) => [
      question.id,
      question,
    ]),
  );

  /*
   * Validamos cada respuesta recibida.
   */
  for (const answer of data.answers) {
    const question = questionMap.get(
      answer.questionId,
    );

    if (!question) {
      throw new Error(
        "Una de las preguntas no pertenece a esta boda",
      );
    }

    validateAnswer(
      question,
      answer.answer,
    );
  }

  /*
   * Verificamos que todas las preguntas obligatorias
   * hayan sido respondidas.
   */
  for (const question of wedding.rsvpQuestions) {
    if (!question.required) {
      continue;
    }

    const answer = data.answers.find(
      (item) =>
        item.questionId === question.id,
    );

    if (
      !answer ||
      answer.answer === null ||
      answer.answer === undefined ||
      answer.answer === ""
    ) {
      throw new Error(
        "Hay preguntas obligatorias sin responder",
      );
    }
  }

  /*
   * Guardamos RSVP + respuestas en una única transacción.
   */
  return prisma.$transaction(async (tx) => {
    const rsvp = await tx.rsvp.upsert({
      where: {
        guestId: guest.id,
      },
      update: {
        status: data.status,
        respondedAt: new Date(),
      },
      create: {
        guestId: guest.id,
        status: data.status,
        respondedAt: new Date(),
      },
    });

    /*
     * Eliminamos las respuestas anteriores para permitir
     * que el invitado pueda modificar su RSVP.
     */
    await tx.rsvpAnswer.deleteMany({
      where: {
        rsvpId: rsvp.id,
      },
    });

    /*
     * Creamos las respuestas nuevas.
     *
     * Prisma requiere InputJsonValue para campos Json.
     */
    if (data.answers.length > 0) {
      await tx.rsvpAnswer.createMany({
        data: data.answers.map((answer) => ({
          rsvpId: rsvp.id,
          questionId: answer.questionId,
          answer:
            answer.answer as Prisma.InputJsonValue,
        })),
      });
    }

    return {
      success: true,
      rsvpId: rsvp.id,
      status: rsvp.status,
    };
  });
}