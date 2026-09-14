"use client";

import { useState } from "react";
import { GiftForm } from "./gift-form";

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
  initialGifts: Gift[];
};

export function GiftManager({ weddingId, initialGifts }: Props) {
  const [gifts, setGifts] = useState(initialGifts);

  const [editing, setEditing] = useState<Gift | null>(null);

  const [creating, setCreating] = useState(false);

  async function removeGift(giftId: string) {
    const confirmed = window.confirm("¿Eliminar este regalo?");

    if (!confirmed) return;

    const response = await fetch(
      `/api/dashboard/weddings/${weddingId}/gifts/${giftId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const data = await response.json();

      window.alert(data.error ?? "No se pudo eliminar el regalo");

      return;
    }

    setGifts(current => current.filter(gift => gift.id !== giftId));
  }

  async function reload() {
    const response = await fetch(`/api/dashboard/weddings/${weddingId}/gifts`);

    if (!response.ok) return;

    const data = await response.json();

    setGifts(data);
    setCreating(false);
    setEditing(null);
  }

  if (creating || editing) {
    return (
      <div className="mt-8 max-w-xl">
        <button
          type="button"
          onClick={() => {
            setCreating(false);
            setEditing(null);
          }}
          className="mb-6 rounded border px-4 py-2"
        >
          Volver
        </button>

        <GiftForm
          weddingId={weddingId}
          gift={editing ?? undefined}
          onSuccess={reload}
        />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => setCreating(true)}
        className="rounded bg-black px-4 py-2 text-white"
      >
        + Agregar regalo
      </button>

      <div className="mt-6 space-y-4">
        {gifts.map(gift => (
          <div key={gift.id} className="rounded border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-bold">{gift.name}</h2>

                {gift.description && (
                  <p className="mt-1 text-gray-600">{gift.description}</p>
                )}

                <div className="mt-3 text-sm">
                  <p>Visible: {gift.isVisible ? "Sí" : "No"}</p>

                  <p>Orden: {gift.sortOrder}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(gift)}
                  className="rounded border px-3 py-2"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => removeGift(gift.id)}
                  className="rounded border px-3 py-2"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}

        {gifts.length === 0 && (
          <p className="py-8 text-gray-500">
            Todavía no hay regalos configurados.
          </p>
        )}
      </div>
    </div>
  );
}
