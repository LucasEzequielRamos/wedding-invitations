import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";

export async function reorderInvitationSections(
  weddingId: string,
  sectionIds: string[],
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

  const sections = await prisma.invitationSection.findMany({
    where: {
      weddingId,
    },
    select: {
      id: true,
    },
  });

  const existingIds = new Set(
    sections.map((section) => section.id),
  );

  if (
    sectionIds.length !== sections.length ||
    sectionIds.some((id) => !existingIds.has(id))
  ) {
    throw new Error("Orden de secciones inválido");
  }

  await prisma.$transaction(
    sectionIds.map((sectionId, index) =>
      prisma.invitationSection.update({
        where: {
          id: sectionId,
        },
        data: {
          sortOrder: index,
        },
      }),
    ),
  );
}