import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";

export async function deleteInvitationSection(
  weddingId: string,
  sectionId: string,
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
    select: {
      id: true,
      status: true,
    },
  });

  if (!wedding) {
    throw new Error("Boda no encontrada");
  }

  if (wedding.status === "COMPLETED") {
    throw new Error("La boda está completada");
  }

  const section = await prisma.invitationSection.findFirst({
    where: {
      id: sectionId,
      weddingId,
    },
  });

  if (!section) {
    throw new Error("Sección no encontrada");
  }

  await prisma.invitationSection.delete({
    where: {
      id: sectionId,
    },
  });
}