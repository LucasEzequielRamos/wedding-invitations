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

type FaqItem = {
  question: string;
  answer: string;
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
    typeof currentConfig.variant === "string"
      ? currentConfig.variant
      : (variants[0]?.id ?? ""),
  );

  const [mediaId, setMediaId] = useState(
    typeof currentConfig.mediaId === "string" ? currentConfig.mediaId : "",
  );

  const [title, setTitle] = useState(
    typeof currentConfig.title === "string" ? currentConfig.title : "",
  );

  const [subtitle, setSubtitle] = useState(
    typeof currentConfig.subtitle === "string" ? currentConfig.subtitle : "",
  );

  const [date, setDate] = useState(
    typeof currentConfig.date === "string" ? currentConfig.date : "",
  );

  const [showDate, setShowDate] = useState(
    typeof currentConfig.showDate === "boolean" ? currentConfig.showDate : true,
  );

  const [galleryLayout, setGalleryLayout] = useState(
    typeof currentConfig.layout === "string" ? currentConfig.layout : "default",
  );

  const [topMediaId, setTopMediaId] = useState(() => {
    if (
      typeof currentConfig.media === "object" &&
      currentConfig.media !== null
    ) {
      const value = (currentConfig.media as Record<string, unknown>).top;

      return typeof value === "string" ? value : "";
    }

    return "";
  });

  const [bottomMediaId, setBottomMediaId] = useState(() => {
    if (
      typeof currentConfig.media === "object" &&
      currentConfig.media !== null
    ) {
      const value = (currentConfig.media as Record<string, unknown>).bottom;

      return typeof value === "string" ? value : "";
    }

    return "";
  });

  const [text, setText] = useState(
    typeof currentConfig.text === "string" ? currentConfig.text : "",
  );

  const [author, setAuthor] = useState(
    typeof currentConfig.author === "string" ? currentConfig.author : "",
  );

  const [align, setAlign] = useState(
    typeof currentConfig.align === "string" ? currentConfig.align : "center",
  );

  const [faqItems, setFaqItems] = useState<FaqItem[]>(() => {
    if (!Array.isArray(currentConfig.items)) {
      return [];
    }

    return currentConfig.items.filter(
      (item): item is FaqItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).question === "string" &&
        typeof (item as Record<string, unknown>).answer === "string",
    );
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addFaqItem() {
    setFaqItems(items => [
      ...items,
      {
        question: "",
        answer: "",
      },
    ]);
  }

  function updateFaqItem(index: number, field: keyof FaqItem, value: string) {
    setFaqItems(items =>
      items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function removeFaqItem(index: number) {
    setFaqItems(items => items.filter((_, itemIndex) => itemIndex !== index));
  }

  async function save() {
    setSaving(true);
    setError("");

    let config: Record<string, unknown> = {};

    /*
     * HERO
     */
    if (section.type === "HERO") {
      config = {
        variant,
        title,
        subtitle,
        showDate,
        date,
        ...(mediaId ? { mediaId } : {}),
      };
    }

    /*
     * COUNTDOWN
     */
    if (section.type === "COUNTDOWN") {
      config = {
        variant,
      };
    }

    /*
     * EVENTS
     */
    if (section.type === "EVENTS") {
      config = {
        variant,
      };
    }

    /*
     * GALLERY
     */
    if (section.type === "GALLERY") {
      config = {
        variant,
        ...(galleryLayout ? { layout: galleryLayout } : {}),
      };
    }

    /*
     * ILLUSTRATION
     */
    if (section.type === "ILLUSTRATION") {
      config = {
        variant,
        mediaId,
      };
    }

    /*
     * CUSTOM
     */
    if (section.type === "CUSTOM") {
      config = {
        variant,
        media: {
          top: topMediaId,
          bottom: bottomMediaId,
        },
      };
    }

    /*
     * TEXT
     */
    if (section.type === "TEXT") {
      config = {
        text,
        align,
        ...(variant ? { variant } : {}),
      };
    }

    /*
     * QUOTE
     */
    if (section.type === "QUOTE") {
      config = {
        text,
        ...(author ? { author } : {}),
        ...(variant ? { variant } : {}),
      };
    }

    /*
     * FAQ
     */
    if (section.type === "FAQ") {
      config = {
        variant,
        ...(title ? { title } : {}),
        items: faqItems,
      };
    }
    /*
     * Micros
     */
    if (section.type === "MICROS") {
      config = {
        variant,
      };
    }

    /*
     * FOOTER
     */
    if (section.type === "FOOTER") {
      config = {
        variant,
        title: title || "Te esperamos!",
        ...(mediaId ? { mediaId } : {}),
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
    <div className="mt-4 rounded-lg border bg-gray-100 p-5 text-gray-900">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-semibold">Configurar {section.type}</h3>

        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Cerrar
        </button>
      </div>

      {variants.length > 0 && (
        <div>
          <label className="mb-1 block text-sm font-medium">Variante</label>

          <select
            value={variant}
            onChange={e => setVariant(e.target.value)}
            className="w-full rounded-md border bg-white px-3 py-2 text-gray-900"
          >
            {variants.map(item => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {section.type === "HERO" && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Título</label>

            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ej: Nacho & Agus"
              className="w-full rounded-md border bg-white px-3 py-2 text-gray-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Subtítulo</label>

            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="Texto opcional"
              className="w-full rounded-md border bg-white px-3 py-2 text-gray-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id={`show-date-${section.id}`}
              type="checkbox"
              checked={showDate}
              onChange={e => setShowDate(e.target.checked)}
              className="h-4 w-4"
            />

            <label
              htmlFor={`show-date-${section.id}`}
              className="text-sm font-medium"
            >
              Mostrar fecha
            </label>
          </div>

          {showDate && (
            <div>
              <label className="mb-1 block text-sm font-medium">Fecha</label>

              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                placeholder="Ej: 16. 01. 27"
                className="w-full rounded-md border bg-white px-3 py-2 text-gray-900"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Imagen del Hero
            </label>

            <MediaSelector
              media={media}
              value={mediaId}
              onChange={setMediaId}
              label="Imagen del Hero"
            />
          </div>
        </div>
      )}

      {section.type === "COUNTDOWN" && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            La fecha utilizada corresponde a la fecha de la boda.
          </p>
        </div>
      )}

      {section.type === "EVENTS" && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Los eventos se administran desde la configuración de eventos de la
            boda.
          </p>
        </div>
      )}

      {section.type === "GALLERY" && (
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium">Distribución</label>

          <select
            value={galleryLayout}
            onChange={e => setGalleryLayout(e.target.value)}
            className="w-full rounded-md border bg-white px-3 py-2 text-gray-900"
          >
            <option value="default">Predeterminada</option>
            <option value="grid">Grilla</option>
            <option value="editorial">Editorial</option>
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
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Imagen inferior
            </label>

            <MediaSelector
              media={media}
              value={bottomMediaId}
              onChange={setBottomMediaId}
              label="Imagen inferior"
            />
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
              className="w-full rounded-md border bg-white px-3 py-2 text-gray-900"
            />
          </div>

          {section.type === "QUOTE" && (
            <div>
              <label className="mb-1 block text-sm font-medium">Autor</label>

              <input
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full rounded-md border bg-white px-3 py-2 text-gray-900"
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
                className="rounded-md border bg-white px-3 py-2 text-gray-900"
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
          )}
        </div>
      )}

      {section.type === "FAQ" && (
        <div className="mt-4 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium">Título</label>

            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Preguntas frecuentes"
              className="w-full rounded-md border bg-white px-3 py-2 text-gray-900"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Preguntas</h4>

              <button
                type="button"
                onClick={addFaqItem}
                className="rounded-md border bg-white px-3 py-2 text-sm hover:bg-gray-50"
              >
                + Agregar pregunta
              </button>
            </div>

            {faqItems.length === 0 && (
              <p className="text-sm text-gray-500">Todavía no hay preguntas.</p>
            )}

            {faqItems.map((item, index) => (
              <div key={index} className="rounded-md border bg-white p-4">
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Pregunta
                    </label>

                    <input
                      type="text"
                      value={item.question}
                      onChange={e =>
                        updateFaqItem(index, "question", e.target.value)
                      }
                      placeholder="¿A qué hora comienza la ceremonia?"
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Respuesta
                    </label>

                    <textarea
                      value={item.answer}
                      onChange={e =>
                        updateFaqItem(index, "answer", e.target.value)
                      }
                      rows={3}
                      placeholder="La ceremonia comienza a las 19:00."
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFaqItem(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Eliminar pregunta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section.type === "FOOTER" && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Texto</label>

            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Te esperamos!"
              className="w-full rounded-md border bg-white px-3 py-2 text-gray-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Imagen</label>

            <MediaSelector
              media={media}
              value={mediaId}
              onChange={setMediaId}
              label="Imagen del footer"
            />
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        disabled={saving}
        onClick={save}
        className="mt-5 rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar configuración"}
      </button>
    </div>
  );
}
