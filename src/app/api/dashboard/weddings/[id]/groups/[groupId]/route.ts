
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";

type Context = {
  params: Promise<{ id: string; groupId: string }>;
};

function getErrorResponse(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;

  const status =
    message === "No autenticado"
      ? 401
      : message === "Boda no encontrada" ||
          message === "Grupo no encontrado"
        ? 404
        : message === "La boda está completada"
          ? 409
          : 400;

  return NextResponse.json({ error: message }, { status });
}

async function authorizeWedding(weddingId: string) {
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
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id, groupId } = await params;
    await authorizeWedding(id);

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name || name.length > 100) {
      return NextResponse.json(
        { error: "El nombre debe tener entre 1 y 100 caracteres." },
        { status: 400 },
      );
    }

    const group = await prisma.guestGroup.findFirst({
      where: { id: groupId, weddingId: id },
    });

    if (!group) {
      throw new Error("Grupo no encontrado");
    }

    const updatedGroup = await prisma.guestGroup.update({
      where: { id: groupId },
      data: { name },
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    return getErrorResponse(error, "No se pudo actualizar el grupo");
  }
}

export async function DELETE(_: Request, { params }: Context) {
  try {
    const { id, groupId } = await params;
    await authorizeWedding(id);

    await prisma.$transaction(async (tx) => {
      const group = await tx.guestGroup.findFirst({
        where: { id: groupId, weddingId: id },
      });

      if (!group) {
        throw new Error("Grupo no encontrado");
      }

      await tx.guest.updateMany({
        where: { groupId },
        data: { groupId: null },
      });

      await tx.guestGroup.delete({
        where: { id: groupId },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return getErrorResponse(error, "No se pudo eliminar el grupo");
  }
}
