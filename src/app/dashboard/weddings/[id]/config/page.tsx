"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type WeddingConfig = {
  plan: "INFORMATIVE" | "FULL";
  status: "DRAFT" | "PUBLISHED" | "COMPLETED";
  weddingDate: string;
  rsvpEnabled: boolean;
  rsvpDeadline: string | null;
  giftsEnabled: boolean;
};

export default function WeddingConfigPage() {
  const params = useParams();
  const weddingId = params.id as string;

  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await fetch(
          `/api/dashboard/weddings/${weddingId}/config`,
        );

        if (!response.ok) {
          throw new Error("No se pudo cargar la configuración");
        }

        const data = await response.json();
        setConfig(data);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Error al cargar configuración",
        );
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, [weddingId]);

  async function handleSave() {
    if (!config) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/config`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rsvpEnabled: config.rsvpEnabled,
            rsvpDeadline: config.rsvpDeadline
              ? new Date(config.rsvpDeadline).toISOString()
              : null,
            giftsEnabled: config.giftsEnabled,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo guardar");
      }

      setConfig(data);
      setMessage("Configuración guardada correctamente");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Error al guardar configuración",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p>Cargando configuración...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-6">
        <p>No se pudo cargar la configuración.</p>
      </div>
    );
  }

  const isCompleted = config.status === "COMPLETED";
  const isFull = config.plan === "FULL";

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración de la boda</h1>

        <p className="mt-1 text-sm text-gray-500">
          Configurá las funciones disponibles para esta invitación.
        </p>
      </div>

      {/* RSVP */}
      <section className="rounded-lg border p-5">
        <h2 className="text-lg font-semibold">Confirmación de asistencia</h2>

        {!isFull && (
          <p className="mt-2 text-sm text-gray-500">
            El RSVP solamente está disponible en el plan FULL.
          </p>
        )}

        <label className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            checked={config.rsvpEnabled}
            disabled={!isFull || isCompleted}
            onChange={event =>
              setConfig({
                ...config,
                rsvpEnabled: event.target.checked,
              })
            }
          />

          <span>Permitir confirmación de asistencia</span>
        </label>

        <div className="mt-4">
          <label className="block text-sm font-medium">
            Fecha límite de RSVP
          </label>

          <input
            type="datetime-local"
            className="mt-1 w-full rounded-md border px-3 py-2"
            disabled={!isFull || !config.rsvpEnabled || isCompleted}
            value={config.rsvpDeadline ? config.rsvpDeadline.slice(0, 16) : ""}
            onChange={event =>
              setConfig({
                ...config,
                rsvpDeadline: event.target.value ? event.target.value : null,
              })
            }
          />
        </div>
      </section>

      {/* REGALOS */}
      <section className="rounded-lg border p-5">
        <h2 className="text-lg font-semibold">Regalos</h2>

        {!isFull && (
          <p className="mt-2 text-sm text-gray-500">
            Los regalos solamente están disponibles en el plan FULL.
          </p>
        )}

        <label className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            checked={config.giftsEnabled}
            disabled={!isFull || isCompleted}
            onChange={event =>
              setConfig({
                ...config,
                giftsEnabled: event.target.checked,
              })
            }
          />

          <span>Mostrar sección de regalos</span>
        </label>
      </section>

      {/* ESTADO */}
      {isCompleted && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm">
          Esta boda está completada. La configuración ya no puede modificarse.
        </div>
      )}

      {message && <p className="text-sm">{message}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || isCompleted}
        className="rounded-md bg-black px-5 py-2 text-white disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar configuración"}
      </button>
    </div>
  );
}
