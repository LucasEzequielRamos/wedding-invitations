import { InvitationEvent } from "../invitation-events";

type Props = {
  events: InvitationEvent[];
};

export function EventsBotanicalEditorial({ events }: Props) {
  if (!events.length) {
    return null;
  }

  return (
    <section className="bg-[#FDF6DC] px-6 py-16 text-[#283517]">
      <div className="mx-auto max-w-[1200px]">
        <div className="space-y-12">
          {events.map(event => (
            <article key={event.id} className="text-center">
              <h2 className="font-[altivo] text-3xl uppercase tracking-[0.08em]">
                {event.name}
              </h2>

              <p className="mt-4 font-[altivo] text-lg">
                {new Intl.DateTimeFormat("es-AR", {
                  dateStyle: "long",
                  timeStyle: "short",
                }).format(new Date(event.date))}
              </p>

              {event.location && (
                <p className="mt-3 text-base">{event.location}</p>
              )}

              {event.address && (
                <p className="mt-1 text-sm opacity-80">{event.address}</p>
              )}

              {event.mapsUrl && (
                <a
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block rounded-full bg-[#566B30] px-7 py-3 text-sm text-white transition-opacity hover:opacity-80"
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
