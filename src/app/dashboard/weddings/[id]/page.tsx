import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import { prisma } from "@/lib/db/prisma";

type WeddingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WeddingDashboardPage({
  params,
}: WeddingPageProps) {
  const { id } = await params;

  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    redirect("/login");
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
      weddingDate: true,
      status: true,
      plan: true,
      rsvpEnabled: true,
      rsvpDeadline: true,
      giftsEnabled: true,

      _count: {
        select: {
          guests: true,
          guestGroups: true,
          rsvpQuestions: true,
          gifts: true,
          events: true,
          media: true,
        },
      },
    },
  });

  if (!wedding) {
    notFound();
  }

  const isCompleted = wedding.status === "COMPLETED";
  const isFull = wedding.plan === "FULL";

  return (
    <main className="mx-auto max-w-6xl p-6">
      {/* HEADER */}
      <div className="mb-8">
        <div className="mb-2">
          <Link
            href="/dashboard/weddings"
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Volver a mis bodas
          </Link>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{wedding.name}</h1>

            <p className="mt-1 text-sm text-gray-500">/{wedding.slug}</p>
          </div>

          <div className="flex gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              {wedding.status}
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              {wedding.plan}
            </span>
          </div>
        </div>
      </div>

      {/* INFORMACIÓN GENERAL */}
      <section className="mb-8 rounded-lg border p-5">
        <h2 className="mb-4 text-lg font-semibold">Información general</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Fecha de la boda</p>

            <p className="font-medium">
              {wedding.weddingDate
                ? new Intl.DateTimeFormat("es-AR", {
                    dateStyle: "long",
                  }).format(wedding.weddingDate)
                : "Fecha no definida"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Invitación pública</p>

            {wedding.status !== "DRAFT" ? (
              <Link
                href={`/invitacion/${wedding.slug}`}
                target="_blank"
                className="font-medium underline"
              >
                Ver invitación →
              </Link>
            ) : (
              <p className="text-sm text-gray-500">
                Disponible cuando la boda sea publicada.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* MÓDULOS */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Administración</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* INVITADOS */}
          <DashboardCard
            href={`/dashboard/weddings/${wedding.id}/guests`}
            title="Invitados"
            description="Administrá los invitados y grupos."
            count={wedding._count.guests}
          />

          {/* RSVP */}
          {isFull && (
            <DashboardCard
              href={`/dashboard/weddings/${wedding.id}/rsvp`}
              title="RSVP"
              description="Consultá las confirmaciones de asistencia."
            />
          )}

          {/* PREGUNTAS */}
          {isFull && (
            <DashboardCard
              href={`/dashboard/weddings/${wedding.id}/questions`}
              title="Preguntas RSVP"
              description="Configurá las preguntas del formulario."
              count={wedding._count.rsvpQuestions}
            />
          )}

          {/* REGALOS */}
          {isFull && (
            <DashboardCard
              href={`/dashboard/weddings/${wedding.id}/gifts`}
              title="Regalos"
              description="Administrá la lista de regalos."
              count={wedding._count.gifts}
            />
          )}

          {/* EVENTOS */}
          <DashboardCard
            href={`/dashboard/weddings/${wedding.id}/events`}
            title="Eventos"
            description="Configurá ceremonia, fiesta y ubicaciones."
            count={wedding._count.events}
          />

          {/* MULTIMEDIA */}
          <DashboardCard
            href={`/dashboard/weddings/${wedding.id}/media`}
            title="Multimedia"
            description="Administrá imágenes y recursos."
            count={wedding._count.media}
          />

          {/* CONFIGURACIÓN */}
          <DashboardCard
            href={`/dashboard/weddings/${wedding.id}/config`}
            title="Configuración"
            description="Configurá RSVP, regalos y funciones de la boda."
          />

          <DashboardCard
            href={`/dashboard/weddings/${wedding.id}/sections`}
            title="Diseño"
            description="Configurá las secciones y estructura de la invitación."
          />
        </div>
      </section>

      {/* ESTADO */}
      {isCompleted && (
        <section className="mt-8 rounded-lg border border-yellow-300 bg-yellow-50 p-5">
          <h2 className="font-semibold">Boda completada</h2>

          <p className="mt-1 text-sm text-gray-700">
            Esta boda está en modo recuerdo. Las funciones administrativas están
            cerradas.
          </p>
        </section>
      )}

      {/* RESUMEN RSVP */}
      {isFull && (
        <section className="mt-8 rounded-lg border p-5">
          <h2 className="mb-4 text-lg font-semibold">Estado del RSVP</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">RSVP</p>

              <p className="font-medium">
                {wedding.rsvpEnabled ? "Habilitado" : "Deshabilitado"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Fecha límite</p>

              <p className="font-medium">
                {wedding.rsvpDeadline
                  ? new Intl.DateTimeFormat("es-AR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(wedding.rsvpDeadline)
                  : "Sin fecha límite"}
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

type DashboardCardProps = {
  href: string;
  title: string;
  description: string;
  count?: number;
};

function DashboardCard({
  href,
  title,
  description,
  count,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="rounded-lg border p-5 transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold">{title}</h3>

        {count !== undefined && (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
            {count}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-500">{description}</p>

      <p className="mt-4 text-sm font-medium">Administrar →</p>
    </Link>
  );
}
