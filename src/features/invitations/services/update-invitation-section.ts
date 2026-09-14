import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import { validateSectionConfig } from "../schemas/invitation-section.schema";

export async function updateInvitationSection(
  weddingId: string,
  sectionId: string,
  data: {
    enabled?: boolean;
    config?: Record<string, unknown> | null;
  },
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
  select: {
    id: true,
    type: true,
  },
});

  if (!section) {
    throw new Error("Sección no encontrada");
  }

  let validatedConfig = data.config;

  if (data.config !== undefined) {
  validatedConfig = validateSectionConfig(
    section.type,
    data.config,
  ) as Record<string, unknown> | null;
}

 return prisma.invitationSection.update({
  where: {
    id: sectionId,
  },
  data: {
    enabled: data.enabled,
    ...(data.config !== undefined
      ? {
          config: JSON.parse(
            JSON.stringify(validatedConfig),
          ),
        }
      : {}),
  },
});
}