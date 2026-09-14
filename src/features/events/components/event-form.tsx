"use client";

import { useState } from "react";

type EventItem = {
  id: string;
  name: string;
  date: Date;
  time: string | null;
  location: string | null;
  address: string | null;
  mapsUrl: string | null;
  sortOrder: number;
};

type Props = {
  weddingId: string;
  event?: EventItem;
  onSuccess?: () => void;
};

export function EventForm({ weddingId, event, onSuccess }: Props) {
  const [name, setName] = useState(event?.name ?? "");

  const [date, setDate] = useState(
    event?.date ? new Date(event.date).toISOString().split("T")[0] : "",
  );

  const [time, setTime] = useState(event?.time ?? "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [address, setAddress] = useState(event?.address ?? "");
  const [mapsUrl, setMapsUrl] = useState(event?.mapsUrl ?? "");

  const [sortOrder, setSortOrder] = useState(event?.sortOrder ?? 0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/events${
          event ? `/${event.id}` : ""
        }`,
        {
          method: event ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            date,
            time,
            location,
            address,
            mapsUrl,
            sortOrder,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo guardar el evento");
      }

      onSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nombre del evento"
        required
      />

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />

      <input type="time" value={time} onChange={e => setTime(e.target.value)} />

      <input
        value={location}
        onChange={e => setLocation(e.target.value)}
        placeholder="Lugar"
      />

      <input
        value={address}
        onChange={e => setAddress(e.target.value)}
        placeholder="Dirección"
      />

      <input
        value={mapsUrl}
        onChange={e => setMapsUrl(e.target.value)}
        placeholder="Enlace de Google Maps"
        type="url"
      />

      <input
        type="number"
        value={sortOrder}
        onChange={e => setSortOrder(Number(e.target.value))}
        placeholder="Orden"
      />

      {error && <p className="text-red-500">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : event ? "Guardar cambios" : "Crear evento"}
      </button>
    </form>
  );
}
