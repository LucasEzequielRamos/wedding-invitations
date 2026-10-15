import { NextResponse } from "next/server";
import { importGuests } from "@/features/guests/services/import-guests";
import { importGuestRowSchema } from "@/features/guests/schemas/import-guests.schema";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!Array.isArray(body.rows) || body.rows.length === 0) {
      return NextResponse.json(
        { error: "No hay invitados para importar" },
        { status: 400 },
      );
    }

    const parsedRows = body.rows.map((row: unknown) =>
      importGuestRowSchema.parse(row),
    );

    const guests = await importGuests(id, parsedRows);

    return NextResponse.json(
      { imported: guests.length },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    console.log(error)

  if (message === "No autenticado") {
    return NextResponse.json(
      { error: "Iniciá sesión para continuar." },
      { status: 401 },
    );
  }

  if (message === "Boda no encontrada") {
    return NextResponse.json(
      { error: "No encontramos esta boda." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      error:
        message,
    },
    { status: 400 },
  );
}
}