import { NextResponse } from "next/server";
import { createGift } from "@/features/gifts/services/create-gift";
import { getWeddingGifts } from "@/features/gifts/services/get-wedding-gifts";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: Context,
) {
  try {
    const { id } = await params;

    const gifts = await getWeddingGifts(id);

    return NextResponse.json(gifts);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudieron obtener los regalos",
      },
      { status: 400 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: Context,
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const gift = await createGift(id, body);

    return NextResponse.json(gift, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo crear el regalo",
      },
      { status: 400 },
    );
  }
}