import { NextResponse } from "next/server";
import { updateEvent } from "@/features/events/services/update-event";
import { deleteEvent } from "@/features/events/services/delete-event";

type Props = {
  params: Promise<{
    id: string;
    eventId: string;
  }>;
};

export async function PUT(
  request: Request,
  { params }: Props,
) {
  try {
    const { id, eventId } = await params;
    const body = await request.json();

    const event = await updateEvent(
      id,
      eventId,
      body,
    );

    return NextResponse.json(event);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el evento",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: Props,
) {
  try {
    const { id, eventId } = await params;

    await deleteEvent(id, eventId);

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
            : "No se pudo eliminar el evento",
      },
      { status: 400 },
    );
  }
}