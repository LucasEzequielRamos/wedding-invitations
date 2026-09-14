import { NextResponse } from "next/server";

import { reorderInvitationSections } from "@/features/invitations/services/reorder-invitation-sections";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await request.json();

    if (!Array.isArray(body.sectionIds)) {
      throw new Error("sectionIds inválido");
    }

    await reorderInvitationSections(
      id,
      body.sectionIds,
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