import { getWeddingEvents } from "@/features/events/services/get-wedding-events";
import { EventManager } from "@/features/events/components/event-manager";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventsPage({ params }: Props) {
  const { id } = await params;

  const events = await getWeddingEvents(id);

  return <EventManager weddingId={id} initialEvents={events} />;
}
