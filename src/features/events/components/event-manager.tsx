"use client";

import { useEffect, useState } from "react";
import { EventForm } from "./event-form";

type EventItem = {
  id: string;
  weddingId: string;
  name: string;
  date: Date;
  time: string | null;
  location: string | null;
  address: string | null;
  mapsUrl: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type Props = {
  weddingId: string;
  initialEvents: EventItem[];
};

export function EventManager({ weddingId, initialEvents }: Props) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);

  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const [creating, setCreating] = useState(false);

  async function reload() {
    const response = await fetch(`/api/dashboard/weddings/${weddingId}/events`);

    if (!response.ok) return;

    const data = await response.json();

    setEvents(data);
  }

  async function handleDelete(eventId: string) {
    const confirmed = window.confirm("¿Querés eliminar este evento?");

    if (!confirmed) return;

    const response = await fetch(
      `/api/dashboard/weddings/${weddingId}/events/${eventId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const data = await response.json();

      alert(data.error ?? "No se pudo eliminar el evento");

      return;
    }

    await reload();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Eventos</h1>

        <button
          onClick={() => {
            setCreating(true);
            setEditingEvent(null);
          }}
        >
          Nuevo evento
        </button>
      </div>

      {creating && (
        <EventForm
          weddingId={weddingId}
          onSuccess={async () => {
            setCreating(false);
            await reload();
          }}
        />
      )}

      {editingEvent && (
        <EventForm
          weddingId={weddingId}
          event={editingEvent}
          onSuccess={async () => {
            setEditingEvent(null);
            await reload();
          }}
        />
      )}

      <div className="space-y-4">
        {events.map(event => (
          <article key={event.id} className="rounded border p-4">
            <h2 className="font-semibold">{event.name}</h2>

            <p>{new Date(event.date).toLocaleDateString("es-AR")}</p>

            {event.time && <p>{event.time}</p>}

            {event.location && <p>{event.location}</p>}

            {event.address && <p>{event.address}</p>}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setEditingEvent(event);
                  setCreating(false);
                }}
              >
                Editar
              </button>

              <button onClick={() => handleDelete(event.id)}>Eliminar</button>
            </div>
          </article>
        ))}

        {events.length === 0 && <p>Todavía no hay eventos.</p>}
      </div>
    </div>
  );
}
