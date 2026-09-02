/* eslint-disable react-hooks/error-boundaries */
import { getWedding } from "@/features/weddings/services/get-wedding";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WeddingPage({ params }: Props) {
  const { id } = await params;

  try {
    const wedding = await getWedding(id);

    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold">{wedding.name}</h1>

        <p className="mt-2">Slug: {wedding.slug}</p>

        <p>Estado: {wedding.status}</p>

        <p>Plan: {wedding.plan}</p>
      </main>
    );
  } catch {
    notFound();
  }
}
