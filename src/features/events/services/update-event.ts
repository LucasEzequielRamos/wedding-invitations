import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import { eventSchema, type EventInput } from "../schemas/event.schema";

export async function updateEvent(
  weddingId: string,
  eventId: string,
  input: EventInput,
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

  if (wedding.status === "COMPLETED") {
    throw new Error("La boda está completada");
  }

  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      weddingId,
    },
  });

  if (!event) {
    throw new Error("Evento no encontrado");
  }

  const data = eventSchema.parse(input);

  return prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      name: data.name,
      date: data.date,
      time: data.time || null,
      location: data.location || null,
      address: data.address || null,
      mapsUrl: data.mapsUrl || null,
      sortOrder: data.sortOrder,
    },
  });
}