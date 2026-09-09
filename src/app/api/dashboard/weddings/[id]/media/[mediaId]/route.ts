import { NextResponse } from "next/server";
import { deleteMedia } from "@/features/media/services/delete-media";

type Props = {
  params: Promise<{
    id: string;
    mediaId: string;
  }>;
};

export async function DELETE(
  _request: Request,
  { params }: Props,
) {
  try {
    const { id, mediaId } = await params;

    await deleteMedia(id, mediaId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo eliminar la imagen",
      },
      { status: 400 },
    );
  }
}