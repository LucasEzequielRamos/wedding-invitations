import { NextResponse } from "next/server";
import { previewGuestsExcel } from "@/features/guests/services/preview-guests-excel";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Seleccioná un archivo Excel" },
        { status: 400 },
      );
    }

    if (!file.name.toLowerCase().endsWith(".xlsx") &&
        !file.name.toLowerCase().endsWith(".xls")) {
      return NextResponse.json(
        { error: "El archivo debe ser Excel (.xlsx o .xls)" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const preview = previewGuestsExcel(buffer);

    // La vista previa no modifica la base de datos.
    // Verificamos además que el usuario tenga acceso a la boda.
    const { getWeddingGuests } = await import(
      "@/features/guests/services/get-wedding-guests"
    );
    await getWeddingGuests(id);

    return NextResponse.json(preview);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al leer el Excel";

    const status = message === "No autenticado" ? 401 :
      message === "Boda no encontrada" ? 404 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}