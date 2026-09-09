import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentAuthUser } from "@/features/auth/services/get-current-user";
import { prisma } from "@/lib/db/prisma";

export default async function WeddingsPage() {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    redirect("/login");
  }

  const weddings = await prisma.wedding.findMany({
    where: {
      members: {
        some: {
          userId: authUser.id,
        },
      },
    },
    orderBy: {
      weddingDate: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      weddingDate: true,
      status: true,
      plan: true,
    },
  });

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mis bodas</h1>

          <p className="mt-1 text-sm text-gray-500">
            Administrá las bodas a las que tenés acceso.
          </p>
        </div>

        <Link
          href="/dashboard/weddings/new"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Nueva boda
        </Link>
      </div>

      {weddings.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-lg font-semibold">Todavía no tenés bodas</h2>

          <p className="mt-2 text-sm text-gray-500">
            Creá una boda para comenzar a configurarla.
          </p>

          <Link
            href="/dashboard/weddings/new"
            className="mt-4 inline-block rounded-md bg-black px-4 py-2 text-sm text-white"
          >
            Crear boda
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {weddings.map(wedding => (
            <Link
              key={wedding.id}
              href={`/dashboard/weddings/${wedding.id}`}
              className="rounded-lg border p-5 transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{wedding.name}</h2>

                  <p className="mt-1 text-sm text-gray-500">/{wedding.slug}</p>
                </div>

                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                  {wedding.status}
                </span>
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <p>
                  <span className="font-medium">Fecha:</span>{" "}
                  {new Intl.DateTimeFormat("es-AR", {
                    dateStyle: "medium",
                  }).format(wedding.weddingDate)}
                </p>

                <p>
                  <span className="font-medium">Plan:</span> {wedding.plan}
                </p>
              </div>

              <div className="mt-5 text-sm font-medium">Administrar →</div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
