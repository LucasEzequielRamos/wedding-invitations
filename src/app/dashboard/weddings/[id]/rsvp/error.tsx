
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RsvpError({ error, reset }: Props) {
  const params = useParams<{ id: string }>();

  useEffect(() => {
    // El detalle técnico queda en la consola del servidor/plataforma,
    // no expuesto en la pantalla de los novios.
    console.error("Error al cargar el dashboard de RSVP:", error);
  }, [error]);

  const unavailable = error.message === "Esta boda no tiene RSVP habilitado";
  const notFound = error.message === "Boda no encontrada";

  const title = unavailable
    ? "RSVP no disponible"
    : notFound
      ? "No encontramos esta boda"
      : "No pudimos cargar las confirmaciones";

  const description = unavailable
    ? "Esta boda no tiene habilitada la gestión de confirmaciones."
    : notFound
      ? "La boda no existe o no tenés acceso a ella."
      : "Hubo un problema al obtener los datos. Tus invitados y sus respuestas no se modificaron. Podés intentar nuevamente.";

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <section
        role="alert"
        className="w-full max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm"
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-50 text-2xl text-amber-700">
          !
        </div>

        <h1 className="mt-5 text-2xl font-semibold">{title}</h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          {description}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {!unavailable && !notFound && (
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Intentar nuevamente
            </button>
          )}

          <Link
            href={`/dashboard/weddings/${params.id}`}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:bg-gray-50"
          >
            Volver al dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
