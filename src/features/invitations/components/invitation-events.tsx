type InvitationEvent = {
  id: string;
  name: string;
  date: Date;
  location: string | null;
  address: string | null;
  mapsUrl: string | null;
};

type Props = {
  events: InvitationEvent[];
};

export function InvitationEvents({ events }: Props) {
  if (!events.length) {
    return null;
  }

  return (
    <section className="bg-[#FDF6DC] px-6 py-16 text-[#283517]">
      <div className="mx-auto max-w-[1200px]">
        <div className="space-y-10">
          {events.map(event => (
            <article key={event.id}>
              <h2 className="text-3xl font-semibold">{event.name}</h2>

              <p className="mt-3">
                {new Intl.DateTimeFormat("es-AR", {
                  dateStyle: "long",
                  timeStyle: "short",
                }).format(event.date)}
              </p>

              {event.location && <p className="mt-2">{event.location}</p>}

              {event.address && <p className="mt-1">{event.address}</p>}

              {event.mapsUrl && (
                <a
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-full bg-[#566B30] px-6 py-3 text-sm text-white"
                >
                  Cómo llegar
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
