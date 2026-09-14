import { NextResponse } from "next/server";
import { getWeddingMedia } from "@/features/media/services/get-wedding-media";
import { uploadMedia } from "@/features/media/services/upload-media";

type Props = {
  params: Promise<{
    id: string;
  }>;
};
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: Props,
) {
  try {
    const { id } = await params;

    const media = await getWeddingMedia(id);

    return NextResponse.json(media);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "No se pudo obtener el contenido multimedia",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: Props,
) {
  try {
    const { id } = await params;

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No se recibió ninguna imagen",
        },
        { status: 400 },
      );
    }

    const type = String(
      formData.get("type") ?? "gallery",
    );

    const alt = String(
      formData.get("alt") ?? "",
    );

    const sortOrder = Number(
      formData.get("sortOrder") ?? 0,
    );

    const media = await uploadMedia(
      id,
      file,
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: type as any,
        alt,
        sortOrder,
      },
    );

    return NextResponse.json(media, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo subir la imagen",
      },
      { status: 400 },
    );
  }
}