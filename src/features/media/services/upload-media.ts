import { prisma } from "@/lib/db/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import {
  mediaSchema,
  type MediaInput,
} from "../schemas/media.schema";
import { processImage } from "./process-image";

const BUCKET = "wedding-media";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function uploadMedia(
  weddingId: string,
  file: File,
  input: MediaInput,
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

  const data = mediaSchema.parse(input);

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      "Formato no permitido. Usá JPG, PNG, WebP o AVIF",
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "La imagen original no puede superar los 5 MB",
    );
  }

  const originalBuffer = Buffer.from(
    await file.arrayBuffer(),
  );

  const processed = await processImage(originalBuffer);

  const fileName = `${crypto.randomUUID()}.webp`;

  const path = `${weddingId}/${data.type}/${fileName}`;

  const supabase = createAdminClient();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, processed.buffer, {
      contentType: processed.mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(
      `No se pudo subir la imagen: ${error.message}`,
    );
  }

  try {
    return await prisma.media.create({
      data: {
        weddingId,
        path,
        type: data.type,
        alt: data.alt || null,
        sortOrder: data.sortOrder,

        mimeType: processed.mimeType,
        sizeBytes: processed.sizeBytes,
        width: processed.width,
        height: processed.height,
      },
    });
  } catch (error) {
    await supabase.storage
      .from(BUCKET)
      .remove([path]);

    throw error;
  }
}