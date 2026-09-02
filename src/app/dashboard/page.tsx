import { redirect } from "next/navigation";
import { ensureCurrentUser } from "@/features/auth/services/ensure-current-user";
import { getMyWeddings } from "@/features/weddings/services/get-my-weddings";

export default async function DashboardPage() {
  const user = await ensureCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const weddings = await getMyWeddings();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p className="mt-2">{user.email}</p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Mis bodas</h2>

        {weddings.length === 0 ? (
          <p className="mt-4 text-gray-500">Todavía no tenés bodas.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {weddings.map(wedding => (
              <div key={wedding.id} className="rounded border p-4">
                <h3 className="font-semibold">{wedding.name}</h3>

                <p className="text-sm text-gray-500">/{wedding.slug}</p>

                <p className="text-sm">Estado: {wedding.status}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
