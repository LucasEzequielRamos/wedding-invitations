import { prisma } from "@/lib/db/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";

const BUCKET = "wedding-media";

export async function deleteMedia(
  weddingId: string,
  mediaId: string,
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

  const media = await prisma.media.findFirst({
    where: {
      id: mediaId,
      weddingId,
    },
  });

  if (!media) {
    throw new Error("Imagen no encontrada");
  }

  const supabase = createAdminClient();

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([media.path]);

  if (error) {
    throw new Error(
      `No se pudo eliminar el archivo: ${error.message}`,
    );
  }

  await prisma.media.delete({
    where: {
      id: mediaId,
    },
  });

  return {
    success: true,
  };
}