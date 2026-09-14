import { PublicRsvpForm } from "@/features/rsvp/components/public-rsvp-form";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicRsvpPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h1 className="mb-6 text-3xl font-bold">Confirmá tu asistencia</h1>

        <PublicRsvpForm slug={slug} />
      </div>
    </main>
  );
}
