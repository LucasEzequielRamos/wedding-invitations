import { NextResponse } from "next/server";
import { submitPublicRsvp } from "@/features/rsvp/services/submit-public-rsvp";

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const result =
      await submitPublicRsvp(body);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo enviar el RSVP",
      },
      { status: 400 },
    );
  }
}