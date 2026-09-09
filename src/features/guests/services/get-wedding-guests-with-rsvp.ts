import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";

export async function getWeddingGuestsWithRsvp(
  weddingId: string,
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
      "Esta boda no tiene RSVP habilitado",
    );
  }

  return prisma.guest.findMany({
    where: {
      weddingId,
    },
    orderBy: [
      {
        lastName: "asc",
      },
      {
        firstName: "asc",
      },
    ],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      group: {
        select: {
          id: true,
          name: true,
        },
      },
      rsvp: {
        select: {
          status: true,
          respondedAt: true,
          answers: {
            select: {
              questionId: true,
              answer: true,
              question: {
                select: {
                  question: true,
                },
              },
            },
          },
        },
      },
    },
  });
}