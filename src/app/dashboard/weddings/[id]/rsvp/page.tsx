import { getWeddingGuestsWithRsvp } from "@/features/guests/services/get-wedding-guests-with-rsvp";
import { getWeddingRsvpStats } from "@/features/rsvp/services/get-wedding-rsvp-stats";
import { RsvpGuestList } from "@/features/rsvp/components/rsvp-guest-list";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WeddingRsvpPage({ params }: PageProps) {
  const { id } = await params;

  const [guests, stats] = await Promise.all([
    getWeddingGuestsWithRsvp(id),
    getWeddingRsvpStats(id),
  ]);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Confirmaciones</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Total" value={stats.totalGuests} />

        <Stat label="Confirmados" value={stats.attending} />

        <Stat label="No asisten" value={stats.notAttending} />

        <Stat label="Pendientes" value={stats.pending} />
      </div>

      <RsvpGuestList guests={guests} />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border p-4">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function RsvpStatus({
  status,
}: {
  status: "PENDING" | "ATTENDING" | "NOT_ATTENDING";
}) {
  const labels = {
    PENDING: "Pendiente",
    ATTENDING: "Confirmado",
    NOT_ATTENDING: "No asiste",
  };

  return <span>{labels[status]}</span>;
}
