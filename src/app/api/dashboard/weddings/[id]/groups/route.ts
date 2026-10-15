import { NextResponse } from "next/server";
import { createGuestGroup } from "@/features/guests/services/create-guest-group";
import { getWeddingGroups } from "@/features/guests/services/get-wedding-groups";

type Context = {
  params: Promise<{ id: string }>;
};

function getErrorResponse(error: unknown, fallback: string) {
  const message =
    error instanceof Error ? error.message : fallback;

  const status =
    message === "No autenticado"
      ? 401
      : message === "Boda no encontrada"
        ? 404
        : message === "La boda está completada"
          ? 409
          : 400;

  return NextResponse.json({ error: message }, { status });
}

export async function GET(_: Request, { params }: Context) {
  try {
    const { id } = await params;
    const groups = await getWeddingGroups(id);

    return NextResponse.json(groups);
  } catch (error) {
    return getErrorResponse(error, "No se pudieron cargar los grupos");
  }
}

export async function POST(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const body = await request.json();

    const group = await createGuestGroup({
      weddingId: id,
      name: body.name,
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    return getErrorResponse(error, "No se pudo crear el grupo");
  }
}