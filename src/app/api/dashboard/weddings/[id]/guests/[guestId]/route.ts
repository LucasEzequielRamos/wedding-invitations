
import { NextResponse } from "next/server";
import { deleteGuest } from "@/features/guests/services/delete-guest";
import { updateGuest } from "@/features/guests/services/update-guest";

type Context = {
  params: Promise<{
    id: string;
    guestId: string;
  }>;
};

function getErrorStatus(message: string) {
  if (message === "No autenticado") return 401;
  if (
    message === "Invitado no encontrado" ||
    message === "Boda no encontrada"
  ) {
    return 404;
  }
  if (message.includes("boda completada")) return 409;
  return 400;
}

function handleError(error: unknown, fallback: string) {
  const message =
    error instanceof Error ? error.message : fallback;

  return NextResponse.json(
    { error: message },
    { status: getErrorStatus(message) },
  );
}

export async function PATCH(
  request: Request,
  { params }: Context,
) {
  try {
    const { id, guestId } = await params;
    const body = await request.json();

    const guest = await updateGuest(id, guestId, {
      firstName: body.firstName,
      lastName: body.lastName,
      groupId: body.groupId || null,
    });

    return NextResponse.json({
      success: true,
      message: "Invitado actualizado correctamente.",
      guest,
    });
  } catch (error) {
    return handleError(error, "No se pudo actualizar el invitado");
  }
}

export async function DELETE(
  _request: Request,
  { params }: Context,
) {
  try {
    const { id, guestId } = await params;

    await deleteGuest(id, guestId);

    return NextResponse.json({
      success: true,
      message: "Invitado eliminado correctamente.",
    });
  } catch (error) {
    return handleError(error, "No se pudo eliminar el invitado");
  }
}
