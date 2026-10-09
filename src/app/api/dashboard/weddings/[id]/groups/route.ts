import { NextResponse } from "next/server";
import { getWeddingGuests } from "@/features/guests/services/get-wedding-guests";
import { createGuest } from "@/features/guests/services/create-guest";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Context) {
  try {
    const { id } = await params;
    const guests = await getWeddingGuests(id);
    const groups = guests
  .filter((guest) => guest.group !== null)
  .map((guest) => guest.group)
  .filter(
    (group, index, arr) =>
      arr.findIndex((g) => g?.id === group?.id) === index,
  );

console.log(groups);
    return NextResponse.json(groups);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al cargar invitados";
    const status = message === "No autenticado" ? 401 :
      message === "Boda no encontrada" ? 404 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const body = await request.json();

    const guest = await createGuest({
      weddingId: id,
      firstName: body.firstName,
      lastName: body.lastName,
      groupId: body.groupId || null,
    });

    return NextResponse.json(guest, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al crear invitado";
    const status = message === "No autenticado" ? 401 :
      message === "Boda no encontrada" ? 404 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}