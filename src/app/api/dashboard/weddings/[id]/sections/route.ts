import { NextResponse } from "next/server";

import { getInvitationSections } from "@/features/invitations/services/get-invitation-sections";
import { createInvitationSection } from "@/features/invitations/services/create-invitation-section";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const sections = await getInvitationSections(id);

    return NextResponse.json(sections);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error interno";

    return NextResponse.json(
      { error: message },
      { status: 400 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const section = await createInvitationSection(
      id,
      body,
    );

    return NextResponse.json(section);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error interno";

    return NextResponse.json(
      { error: message },
      { status: 400 },
    );
  }
}