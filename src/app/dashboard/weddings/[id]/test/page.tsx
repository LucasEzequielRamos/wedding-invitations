import { createGuestGroup } from "@/features/guests/services/create-guest-group";
import { createGuest } from "@/features/guests/services/create-guest";
import { getWeddingGuests } from "@/features/guests/services/get-wedding-guests";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TestGuestsPage({ params }: Props) {
  const { id } = await params;

  async function testCreateGroup() {
    "use server";

    await createGuestGroup({
      weddingId: id,
      name: "Familia Pérez",
    });
  }

  async function testCreateGuest() {
    "use server";

    await createGuest({
      weddingId: id,
      firstName: "Juan",
      lastName: "Pérez",
    });
  }

  async function testGetGuests() {
    "use server";

    const guests = await getWeddingGuests(id);

    console.log("INVITADOS:", guests);
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Test de invitados</h1>

      <div className="mt-6 flex flex-col gap-4">
        <form action={testCreateGroup}>
          <button className="rounded bg-black px-4 py-2 text-white">
            Crear grupo
          </button>
        </form>

        <form action={testCreateGuest}>
          <button className="rounded bg-black px-4 py-2 text-white">
            Crear invitado
          </button>
        </form>

        <form action={testGetGuests}>
          <button className="rounded bg-black px-4 py-2 text-white">
            Obtener invitados
          </button>
        </form>
      </div>
    </main>
  );
}
