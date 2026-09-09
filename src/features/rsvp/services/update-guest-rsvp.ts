import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";

type RsvpStatus = "PENDING" | "ATTENDING" | "NOT_ATTENDING";

export async function updateGuestRsvp(
  weddingId: string,
  guestId: string,
  status: RsvpStatus,
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

  const guest = await prisma.guest.findFirst({
    where: {
      id: guestId,
      weddingId,
    },
  });

  if (!guest) {
    throw new Error("Invitado no encontrado");
  }

  return prisma.rsvp.upsert({
    where: {
      guestId,
    },
    update: {
      status,
      respondedAt:
        status === "PENDING"
          ? null
          : new Date(),
    },
    create: {
      guestId,
      status,
      respondedAt:
        status === "PENDING"
          ? null
          : new Date(),
    },
  });
}