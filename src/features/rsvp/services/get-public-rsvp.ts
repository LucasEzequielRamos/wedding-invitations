import { prisma } from "@/lib/db/prisma";

export async function getPublicRsvp(
  slug: string,
  firstName: string,
  lastName: string,
) {
  const normalizedFirstName = firstName.trim();
  const normalizedLastName = lastName.trim();

  if (!normalizedFirstName || !normalizedLastName) {
    throw new Error("Nombre y apellido son obligatorios");
  }

  const wedding = await prisma.wedding.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      status: true,
      plan: true,
      rsvpQuestions: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          id: true,
          question: true,
          type: true,
          required: true,
          options: true,
          sortOrder: true,
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

  console.log(wedding.status)

  if (wedding.status !== "PUBLISHED") {
    throw new Error("El RSVP no está disponible");
  }

  const guests = await prisma.guest.findMany({
    where: {
      weddingId: wedding.id,
      firstName: {
        equals: normalizedFirstName,
        mode: "insensitive",
      },
      lastName: {
        equals: normalizedLastName,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      rsvp: {
        select: {
          status: true,
          respondedAt: true,
          answers: {
            select: {
              questionId: true,
              answer: true,
            },
          },
        },
      },
    },
  });

  if (guests.length === 0) {
    throw new Error("No encontramos un invitado con esos datos");
  }

  if (guests.length > 1) {
    throw new Error(
      "Encontramos más de un invitado con ese nombre. Ingresá el nombre y apellido completo.",
    );
  }

  const guest = guests[0];

  return {
    wedding: {
      id: wedding.id,
      name: wedding.name,
    },
    guest: {
      id: guest.id,
      firstName: guest.firstName,
      lastName: guest.lastName,
    },
    rsvp: guest.rsvp
      ? {
          status: guest.rsvp.status,
          respondedAt: guest.rsvp.respondedAt,
          answers: guest.rsvp.answers,
        }
      : {
          status: "PENDING" as const,
          respondedAt: null,
          answers: [],
        },
    questions: wedding.rsvpQuestions,
  };
}