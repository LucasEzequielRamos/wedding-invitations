"use client";

import { useEffect, useState } from "react";

type EventItem = {
  id: string;
  name: string;
  date: string;
  time: string | null;
  location: string | null;
  address: string | null;
  mapsUrl: string | null;
};

type Props = {
  slug: string;
};

export function PublicEventList({ slug }: Props) {
  const [events, setEvents] = useState<EventItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch(`/api/invitacion/${slug}/events`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "No se pudieron cargar los eventos");
        }

        setEvents(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Ocurrió un error");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [slug]);

  if (loading) {
    return <p>Cargando eventos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section>
      <h2>Eventos</h2>

      <div>
        {events.map(event => (
          <article key={event.id}>
            <h3>{event.name}</h3>

            <p>{new Date(event.date).toLocaleDateString("es-AR")}</p>

            {event.time && <p>{event.time}</p>}

            {event.location && <p>{event.location}</p>}

            {event.address && <p>{event.address}</p>}

            {event.mapsUrl && (
              <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer">
                Ver ubicación
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
