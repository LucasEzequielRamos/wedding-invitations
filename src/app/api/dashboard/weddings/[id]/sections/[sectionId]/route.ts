import { NextResponse } from "next/server";

import { updateInvitationSection } from "@/features/invitations/services/update-invitation-section";
import { deleteInvitationSection } from "@/features/invitations/services/delete-invitation-section";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      sectionId: string;
    }>;
  },
) {
  try {
    const { id, sectionId } = await params;

    const body = await request.json();

    const section = await updateInvitationSection(
      id,
      sectionId,
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

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      sectionId: string;
    }>;
  },
) {
  try {
    const { id, sectionId } = await params;

    await deleteInvitationSection(
      id,
      sectionId,
    );

    return NextResponse.json({
      success: true,
    });
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