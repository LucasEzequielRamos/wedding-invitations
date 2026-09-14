import { NextResponse } from "next/server";
import { getPublicRsvp } from "@/features/rsvp/services/get-public-rsvp";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { slug } = await params;

    const body = await request.json();

    const result = await getPublicRsvp(
      slug,
      body.firstName,
      body.lastName,
    );

    return NextResponse.json({
      weddingId: result.wedding.id,
      guestId: result.guest.id,
      guestName: `${result.guest.firstName} ${result.guest.lastName}`,
      status: result.rsvp.status,
      answers: result.rsvp.answers,
      questions: result.questions,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo encontrar la invitación",
      },
      { status: 400 },
    );
  }
}