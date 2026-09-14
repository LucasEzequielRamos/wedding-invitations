import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authUser = await getCurrentAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 },
      );
    }

    const wedding = await prisma.wedding.findFirst({
      where: {
        id,
        members: {
          some: {
            userId: authUser.id,
          },
        },
      },
      select: {
  id: true,
  name: true,
  slug: true,
  status: true,
  plan: true,
},
    });

    if (!wedding) {
      return NextResponse.json(
        { error: "Boda no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(wedding);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error interno";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}