import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import {
  invitationSectionSchema,
  validateSectionConfig,
} from "../schemas/invitation-section.schema";

export async function createInvitationSection(
  weddingId: string,
  input: unknown,
) {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    throw new Error("No autenticado");
  }

  const parsed = invitationSectionSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Sección inválida");
  }

  const validatedConfig = validateSectionConfig(
  parsed.data.type,
  parsed.data.config,
);

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
  plan: true,
},
  });

  if (!wedding) {
    throw new Error("Boda no encontrada");
  }

  if (
  wedding.plan === "INFORMATIVE" &&
  (parsed.data.type === "RSVP" || parsed.data.type === "GIFTS")
) {
  throw new Error(
    "Las secciones RSVP y Regalos requieren una boda FULL",
  );
}

  if (wedding.status === "COMPLETED") {
    throw new Error("La boda está completada");
  }

  const lastSection = await prisma.invitationSection.findFirst({
    where: {
      weddingId,
    },
    orderBy: {
      sortOrder: "desc",
    },
    select: {
      sortOrder: true,
    },
  });

  const sortOrder = lastSection
    ? lastSection.sortOrder + 1
    : 0;

  return prisma.invitationSection.create({
    data: {
      weddingId,
      type: parsed.data.type,
      enabled: parsed.data.enabled,
      sortOrder,
      config: validatedConfig
  ? JSON.parse(JSON.stringify(validatedConfig))
  : undefined,
    },
  });
}