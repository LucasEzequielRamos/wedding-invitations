import { NextResponse } from "next/server";
import { getWeddingEvents } from "@/features/events/services/get-wedding-events";
import { createEvent } from "@/features/events/services/create-event";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: Props,
) {
  try {
    const { id } = await params;

    const events = await getWeddingEvents(id);

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "No se pudieron obtener los eventos" },
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
    const body = await request.json();

    const event = await createEvent(id, body);

    return NextResponse.json(event, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo crear el evento",
      },
      { status: 400 },
    );
  }
}