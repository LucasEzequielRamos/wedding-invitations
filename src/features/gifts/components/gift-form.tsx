"use client";

import { useState } from "react";

type Gift = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  externalUrl: string | null;
  paymentUrl: string | null;
  sortOrder: number;
  isVisible: boolean;
};

type Props = {
  weddingId: string;
  gift?: Gift;
  onSuccess?: () => void;
};

export function GiftForm({ weddingId, gift, onSuccess }: Props) {
  const [name, setName] = useState(gift?.name ?? "");

  const [description, setDescription] = useState(gift?.description ?? "");

  const [image, setImage] = useState(gift?.image ?? "");

  const [externalUrl, setExternalUrl] = useState(gift?.externalUrl ?? "");

  const [paymentUrl, setPaymentUrl] = useState(gift?.paymentUrl ?? "");

  const [sortOrder, setSortOrder] = useState(gift?.sortOrder ?? 0);

  const [isVisible, setIsVisible] = useState(gift?.isVisible ?? true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/gifts${
          gift ? `/${gift.id}` : ""
        }`,
        {
          method: gift ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            image,
            externalUrl,
            paymentUrl,
            sortOrder,
            isVisible,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo guardar el regalo");
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
        placeholder="Nombre del regalo"
        className="w-full rounded border p-3"
        required
      />

      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Descripción"
        className="w-full rounded border p-3"
        rows={3}
      />

      <input
        value={image}
        onChange={e => setImage(e.target.value)}
        placeholder="URL de imagen"
        className="w-full rounded border p-3"
      />

      <input
        value={externalUrl}
        onChange={e => setExternalUrl(e.target.value)}
        placeholder="URL externa"
        className="w-full rounded border p-3"
      />

      <input
        value={paymentUrl}
        onChange={e => setPaymentUrl(e.target.value)}
        placeholder="URL de pago"
        className="w-full rounded border p-3"
      />

      <input
        type="number"
        value={sortOrder}
        onChange={e => setSortOrder(Number(e.target.value))}
        placeholder="Orden"
        className="w-full rounded border p-3"
      />

      <label className="flex gap-2">
        <input
          type="checkbox"
          checked={isVisible}
          onChange={e => setIsVisible(e.target.checked)}
        />
        Visible en la invitación
      </label>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-black p-3 text-white disabled:opacity-50"
      >
        {loading ? "Guardando..." : gift ? "Guardar cambios" : "Crear regalo"}
      </button>
    </form>
  );
}
