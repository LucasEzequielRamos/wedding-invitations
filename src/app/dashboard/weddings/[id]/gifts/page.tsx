import { getWeddingGifts } from "@/features/gifts/services/get-wedding-gifts";
import { GiftManager } from "@/features/gifts/components/gift-manager";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GiftsPage({ params }: PageProps) {
  const { id } = await params;

  const gifts = await getWeddingGifts(id);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Regalos</h1>

      <p className="mt-2 text-gray-600">
        Administrá los regalos que aparecerán en la invitación.
      </p>

      <GiftManager weddingId={id} initialGifts={gifts} />
    </main>
  );
}
