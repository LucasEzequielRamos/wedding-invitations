import { NextResponse } from "next/server";
import { getPublicMedia } from "@/features/media/services/get-public-media";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: Props,
) {
  try {
    const { slug } = await params;

    const media = await getPublicMedia(slug);

    const baseUrl =
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}` +
      `/storage/v1/object/public/wedding-media/`;

    const result = media.map((item) => ({
      ...item,
      url: `${baseUrl}${item.path}`,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "No se pudo obtener el contenido multimedia",
      },
      { status: 404 },
    );
  }
}