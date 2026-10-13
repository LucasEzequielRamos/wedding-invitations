
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getPublicRsvp } from "@/features/rsvp/services/get-public-rsvp";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const fullName = String(body.fullName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const busStopId = String(body.busStopId ?? "");

    const parts = fullName.split(/\s+/);
    if (parts.length < 2) {
      return NextResponse.json(
        { error: "Ingresá tu nombre completo." },
        { status: 400 },
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Ingresá tu teléfono." },
        { status: 400 },
      );
    }

    if (!busStopId) {
      return NextResponse.json(
        { error: "Elegí una parada." },
        { status: 400 },
      );
    }

    const result = await getPublicRsvp(
      slug,
      parts[0],
      parts.slice(1).join(" "),
    );

    if (result.rsvp.status === "PENDING") {
      throw new Error(
        "Primero tenés que confirmar tu asistencia antes de solicitar el micro.",
      );
    }

    if (result.rsvp.status === "NOT_ATTENDING") {
      throw new Error(
        "Como confirmaste que no vas a asistir, no podés solicitar el micro.",
      );
    }

    if (!result.wedding.busesEnabled) {
      throw new Error("La reserva de micros no está habilitada.");
    }

    const stop = await prisma.busStop.findFirst({
      where: {
        id: busStopId,
        bus: { weddingId: result.wedding.id },
      },
      select: { id: true },
    });

    if (!stop) {
      throw new Error("La parada seleccionada no es válida.");
    }

    await prisma.rsvp.upsert({
      where: { guestId: result.guest.id },
      update: {
        needsBus: true,
        busStopId: stop.id,
        busPhone: phone,
      },
      create: {
        guestId: result.guest.id,
        needsBus: true,
        busStopId: stop.id,
        busPhone: phone,
      },
    });

    return NextResponse.json({
      success: true,
      message: "¡Tu viaje quedó registrado!",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo registrar el viaje.",
      },
      { status: 400 },
    );
  }
}
