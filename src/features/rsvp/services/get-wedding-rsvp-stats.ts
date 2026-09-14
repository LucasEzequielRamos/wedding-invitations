import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";

export async function getWeddingRsvpStats(weddingId: string) {
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

  const [totalGuests, attending, notAttending, pendingRsvps] =
    await Promise.all([
      prisma.guest.count({
        where: {
          weddingId,
        },
      }),

      prisma.rsvp.count({
        where: {
          guest: {
            weddingId,
          },
          status: "ATTENDING",
        },
      }),

      prisma.rsvp.count({
        where: {
          guest: {
            weddingId,
          },
          status: "NOT_ATTENDING",
        },
      }),

      prisma.rsvp.count({
        where: {
          guest: {
            weddingId,
          },
          status: "PENDING",
        },
      }),
    ]);

  const pending = totalGuests - attending - notAttending;

  return {
    totalGuests,
    pending,
    attending,
    notAttending,
    pendingRsvps,
  };
}