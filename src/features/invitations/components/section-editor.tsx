"use client";

import { useState } from "react";
import { MediaSelector } from "./media-selector";
import { sectionVariants } from "../config/section-variants";

type Section = {
  id: string;
  type: string;
  enabled: boolean;
  sortOrder: number;
  config: unknown;
};

type MediaItem = {
  id: string;
  path: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

type Props = {
  weddingId: string;
  section: Section;
  media: MediaItem[];
  onSaved: () => void;
  onClose: () => void;
};

export function SectionEditor({
  weddingId,
  section,
  media,
  onSaved,
  onClose,
}: Props) {
  const currentConfig =
    section.config && typeof section.config === "object"
      ? (section.config as Record<string, unknown>)
      : {};

  const variants =
    sectionVariants[section.type as keyof typeof sectionVariants] ?? [];

  const [variant, setVariant] = useState(
    typeof currentConfig.variant === "string" ? currentConfig.variant : "",
  );

  const [mediaId, setMediaId] = useState(
    typeof currentConfig.mediaId === "string" ? currentConfig.mediaId : "",
  );

  const [topMediaId, setTopMediaId] = useState(
    typeof currentConfig.media === "object" &&
      currentConfig.media !== null &&
      typeof (currentConfig.media as Record<string, unknown>).top === "string"
      ? ((currentConfig.media as Record<string, unknown>).top as string)
      : "",
  );

  const [bottomMediaId, setBottomMediaId] = useState(
    typeof currentConfig.media === "object" &&
      currentConfig.media !== null &&
      typeof (currentConfig.media as Record<string, unknown>).bottom ===
        "string"
      ? ((currentConfig.media as Record<string, unknown>).bottom as string)
      : "",
  );

  const [text, setText] = useState(
    typeof currentConfig.text === "string" ? currentConfig.text : "",
  );

  const [author, setAuthor] = useState(
    typeof currentConfig.author === "string" ? currentConfig.author : "",
  );

  const [align, setAlign] = useState(
    typeof currentConfig.align === "string" ? currentConfig.align : "center",
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");

    let config: Record<string, unknown> = {};

    if (section.type === "ILLUSTRATION") {
      config = {
        variant,
        mediaId,
      };
    }

    if (section.type === "CUSTOM") {
      config = {
        variant,
        media: {
          top: topMediaId,
          bottom: bottomMediaId,
        },
      };
    }

    if (section.type === "TEXT") {
      config = {
        text,
        align,
        ...(variant ? { variant } : {}),
      };
    }

    if (section.type === "QUOTE") {
      config = {
        text,
        ...(author ? { author } : {}),
        ...(variant ? { variant } : {}),
      };
    }

    const response = await fetch(
      `/api/dashboard/weddings/${weddingId}/sections/${section.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          config,
        }),
      },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      setError(data?.error ?? "No se pudo guardar la configuración");

      setSaving(false);
      return;
    }

    setSaving(false);
    onSaved();
  }

  return (
    <div className="mt-4 rounded-lg border bg-gray-50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-semibold">Configurar {section.type}</h3>

        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-500"
        >
          Cerrar
        </button>
      </div>

      {(section.type === "ILLUSTRATION" ||
        (section.type === "CUSTOM" && variants.length > 0)) && (
        <div>
          <label className="mb-1 block text-sm font-medium">Variante</label>

          <select
            value={variant}
            onChange={e => setVariant(e.target.value)}
            className="w-full rounded-md border bg-white px-3 py-2"
          >
            {variants.map(item => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {section.type === "ILLUSTRATION" && (
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium">Ilustración</label>

          <MediaSelector
            media={media}
            value={mediaId}
            onChange={setMediaId}
            label="Ilustración"
          />
        </div>
      )}

      {section.type === "CUSTOM" && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Imagen superior
            </label>

            <MediaSelector
              media={media}
              value={topMediaId}
              onChange={setTopMediaId}
              label="Imagen superior"
            />

            <MediaSelector
              media={media}
              value={bottomMediaId}
              onChange={setBottomMediaId}
              label="Imagen inferior"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Imagen inferior
            </label>

            <select
              value={bottomMediaId}
              onChange={e => setBottomMediaId(e.target.value)}
              className="w-full rounded-md border bg-white px-3 py-2"
            >
              <option value="">Seleccionar imagen</option>

              {media.map(item => (
                <option key={item.id} value={item.id}>
                  {item.alt || item.id}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {(section.type === "TEXT" || section.type === "QUOTE") && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Texto</label>

            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              className="w-full rounded-md border bg-white px-3 py-2"
            />
          </div>

          {section.type === "QUOTE" && (
            <div>
              <label className="mb-1 block text-sm font-medium">Autor</label>

              <input
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full rounded-md border bg-white px-3 py-2"
              />
            </div>
          )}

          {section.type === "TEXT" && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                Alineación
              </label>

              <select
                value={align}
                onChange={e => setAlign(e.target.value)}
                className="rounded-md border bg-white px-3 py-2"
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        disabled={saving}
        onClick={save}
        className="mt-5 rounded-md border bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar configuración"}
      </button>
    </div>
  );
}
