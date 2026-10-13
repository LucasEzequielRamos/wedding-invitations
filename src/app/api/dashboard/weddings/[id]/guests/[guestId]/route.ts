
import { NextResponse } from "next/server";
import { deleteGuest } from "@/features/guests/services/delete-guest";

type Context = {
  params: Promise<{
    id: string;
    guestId: string;
  }>;
};

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
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo eliminar el invitado";

    const status =
      message === "No autenticado"
        ? 401
        : message === "Invitado no encontrado"
          ? 404
          : 400;

    return NextResponse.json({ error: message }, { status });
  }
}
