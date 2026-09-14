import { NextResponse } from "next/server";
import { getWeddingConfig } from "@/features/weddings/services/get-wedding-config";
import { updateWeddingConfig } from "@/features/weddings/services/update-wedding-config";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const config = await getWeddingConfig(id);

    return NextResponse.json(config);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error interno";

    return NextResponse.json(
      { error: message },
      { status: 400 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const config = await updateWeddingConfig(id, body);

    return NextResponse.json(config);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error interno";

    return NextResponse.json(
      { error: message },
      { status: 400 },
    );
  }
}