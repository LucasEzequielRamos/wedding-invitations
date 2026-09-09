type InvitationEvent = {
  id: string;
  name: string;
  date: Date;
  time: string | null;
  location: string | null;
  address: string | null;
  mapsUrl: string | null;
};

type InvitationEventsProps = {
  events: InvitationEvent[];
};

export function InvitationEvents({ events }: InvitationEventsProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">Eventos</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {events.map(event => (
          <article key={event.id} className="rounded-xl border p-6">
            <h3 className="text-xl font-semibold">{event.name}</h3>

            <p className="mt-3 text-gray-600">
              {new Intl.DateTimeFormat("es-AR", {
                dateStyle: "long",
              }).format(event.date)}
            </p>

            {event.time && <p className="mt-1 text-gray-600">{event.time}</p>}

            {event.location && (
              <p className="mt-4 font-medium">{event.location}</p>
            )}

            {event.address && (
              <p className="mt-1 text-sm text-gray-500">{event.address}</p>
            )}

            {event.mapsUrl && (
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block text-sm font-medium underline"
              >
                Ver ubicación →
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
