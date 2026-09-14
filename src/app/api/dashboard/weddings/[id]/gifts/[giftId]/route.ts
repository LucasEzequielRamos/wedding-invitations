import { NextResponse } from "next/server";
import { updateGift } from "@/features/gifts/services/update-gift";
import { deleteGift } from "@/features/gifts/services/delete-gift";

type Context = {
  params: Promise<{
    id: string;
    giftId: string;
  }>;
};

export async function PUT(
  request: Request,
  { params }: Context,
) {
  try {
    const { id, giftId } = await params;

    const body = await request.json();

    const gift = await updateGift(
      id,
      giftId,
      body,
    );

    return NextResponse.json(gift);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el regalo",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: Context,
) {
  try {
    const { id, giftId } = await params;

    await deleteGift(id, giftId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo eliminar el regalo",
      },
      { status: 400 },
    );
  }
}