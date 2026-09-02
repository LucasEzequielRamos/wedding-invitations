import { redirect } from "next/navigation";
import { createWedding } from "@/features/weddings/services/create-wedding";

export default function NewWeddingPage() {
  async function handleCreateWedding() {
    "use server";

    const wedding = await createWedding({
      name: "Boda de prueba 2",
      slug: "boda-de-prueba-2",
      weddingDate: new Date("2027-05-15"),
      plan: "FULL",
    });

    redirect(`/dashboard/weddings/${wedding.id}`);
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Nueva boda</h1>

      <form action={handleCreateWedding}>
        <button
          type="submit"
          className="mt-4 rounded bg-black px-4 py-2 text-white"
        >
          Crear boda
        </button>
      </form>
    </main>
  );
}
