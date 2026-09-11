/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SectionEditor } from "@/features/invitations/components/section-editor";

type Section = {
  id: string;
  type: string;
  enabled: boolean;
  sortOrder: number;
  config: unknown;
};

const sectionLabels: Record<string, string> = {
  HERO: "Hero",
  COUNTDOWN: "Cuenta regresiva",
  EVENTS: "Eventos",
  GALLERY: "Galería",
  RSVP: "RSVP",
  GIFTS: "Regalos",
  QUOTE: "Frase",
  TEXT: "Texto",
  ILLUSTRATION: "Ilustración",
  TIMELINE: "Timeline",
  FOOTER: "Footer",
  CUSTOM: "Personalizada",
};

const sectionTypes = Object.keys(sectionLabels);

export default function InvitationSectionsPage() {
  const params = useParams();

  const weddingId = params.id as string;

  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [media, setMedia] = useState<any[]>([]);

  async function loadWedding() {
    try {
      const response = await fetch(`/api/dashboard/weddings/${weddingId}`);

      if (!response.ok) {
        throw new Error("No se pudo cargar la boda");
      }

      const data = await response.json();

      setSlug(data.slug);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Error al cargar la boda",
      );
    }
  }

  async function loadMedia() {
    const response = await fetch(`/api/dashboard/weddings/${weddingId}/media`);

    if (!response.ok) return;

    const data = await response.json();

    setMedia(data);
  }

  async function loadSections() {
    try {
      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/sections`,
      );

      if (!response.ok) {
        throw new Error("No se pudieron cargar las secciones");
      }

      const data = await response.json();

      setSections(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSections();
    loadMedia();
    loadWedding();
  }, [weddingId]);

  async function addSection(type: string) {
    let config: Record<string, unknown> | null = null;

    switch (type) {
      case "ILLUSTRATION":
        config = {
          variant: "floral-divider",
          mediaId: "",
        };
        break;

      case "CUSTOM":
        config = {
          variant: "romantic-floral",
          media: {
            top: "",
            bottom: "",
          },
        };
        break;

      case "TEXT":
        config = {
          text: "",
          align: "center",
        };
        break;

      case "QUOTE":
        config = {
          text: "",
          author: "",
        };
        break;

      default:
        config = {};
        break;
    }

    const response = await fetch(
      `/api/dashboard/weddings/${weddingId}/sections`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          enabled: true,
          config,
        }),
      },
    );

    if (!response.ok) {
      const data = await response.json();

      setMessage(data.error || "No se pudo crear la sección");

      return;
    }

    const created = await response.json();

    await loadSections();

    setEditingSectionId(created.id);
  }

  async function toggleSection(section: Section) {
    const response = await fetch(
      `/api/dashboard/weddings/${weddingId}/sections/${section.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: !section.enabled,
        }),
      },
    );

    if (!response.ok) {
      setMessage("No se pudo actualizar la sección");
      return;
    }

    await loadSections();
  }

  async function deleteSection(sectionId: string) {
    const confirmed = window.confirm("¿Eliminar esta sección?");

    if (!confirmed) return;

    const response = await fetch(
      `/api/dashboard/weddings/${weddingId}/sections/${sectionId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      setMessage("No se pudo eliminar la sección");
      return;
    }

    await loadSections();
  }

  async function moveSection(index: number, direction: -1 | 1) {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= sections.length) {
      return;
    }

    const newSections = [...sections];

    const [moved] = newSections.splice(index, 1);

    newSections.splice(newIndex, 0, moved);

    setSections(newSections);

    const response = await fetch(
      `/api/dashboard/weddings/${weddingId}/sections/reorder`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sectionIds: newSections.map(section => section.id),
        }),
      },
    );

    if (!response.ok) {
      setMessage("No se pudo guardar el orden");
      await loadSections();
    }
  }

  if (loading) {
    return <main className="p-6">Cargando secciones...</main>;
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Secciones de la invitación</h1>

          <p className="mt-2 text-sm text-gray-500">
            Definí la estructura y el orden de la invitación.
          </p>
        </div>

        <button
          type="button"
          disabled={!slug}
          onClick={() => {
            if (!slug) return;

            window.open(`/invitacion/${slug}`, "_blank", "noopener,noreferrer");
          }}
          className="whitespace-nowrap rounded-md border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          👁 Ver invitación
        </button>
      </div>

      <section className="rounded-lg border p-5">
        <h2 className="mb-4 font-semibold">Agregar sección</h2>

        <div className="flex flex-wrap gap-2">
          {sectionTypes.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => addSection(type)}
              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            >
              + {sectionLabels[type]}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        {sections.length === 0 ? (
          <div className="rounded-lg border p-8 text-center text-sm text-gray-500">
            Todavía no hay secciones.
          </div>
        ) : (
          sections.map((section, index) => (
            <div key={section.id}>
              <article className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex flex-col">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveSection(index, -1)}
                    className="px-2 disabled:opacity-30"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    disabled={index === sections.length - 1}
                    onClick={() => moveSection(index, 1)}
                    className="px-2 disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>

                <div className="flex-1">
                  <p className="font-medium">
                    {sectionLabels[section.type] ?? section.type}
                  </p>

                  <p className="text-xs text-gray-500">{section.type}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleSection(section)}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  {section.enabled ? "Activo" : "Desactivado"}
                </button>

                <button
                  type="button"
                  onClick={() => deleteSection(section.id)}
                  className="rounded-md border px-3 py-2 text-sm text-red-600"
                >
                  Eliminar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setEditingSectionId(
                      editingSectionId === section.id ? null : section.id,
                    )
                  }
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  {editingSectionId === section.id ? "Cerrar editor" : "Editar"}
                </button>
              </article>

              {editingSectionId === section.id && (
                <SectionEditor
                  weddingId={weddingId}
                  section={section}
                  media={media}
                  onSaved={async () => {
                    await loadSections();
                  }}
                  onClose={() => setEditingSectionId(null)}
                />
              )}
            </div>
          ))
        )}
      </section>

      {message && <p className="text-sm text-red-600">{message}</p>}
    </main>
  );
}
