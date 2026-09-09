import { NextResponse } from "next/server";
import { getPublicGifts } from "@/features/gifts/services/get-public-gifts";

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

    const gifts = await getPublicGifts(slug);

    return NextResponse.json(gifts);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "No se pudieron obtener los regalos" },
      { status: 404 },
    );
  }
}