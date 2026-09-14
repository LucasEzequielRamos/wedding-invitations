import { NextResponse } from "next/server";
import { getPublicEvents } from "@/features/events/services/get-public-events";

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

    const events = await getPublicEvents(slug);

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "No se pudieron obtener los eventos",
      },
      { status: 404 },
    );
  }
}