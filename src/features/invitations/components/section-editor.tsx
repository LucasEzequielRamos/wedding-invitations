"use client";

import { useMemo, useState } from "react";
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
  type?: string;
};
type Props = {
  weddingId: string;
  section: Section;
  media: MediaItem[];
  onSaved: () => void;
  onClose: () => void;
};

type TimelineItem = {
  title: string;
  description: string;
  date: string;
  mediaId: string;
};
type FaqItem = { question: string; answer: string };

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-600 focus:ring-2 focus:ring-slate-200";
const selectClass = fieldClass;
const labelClass = "text-sm font-semibold text-slate-800";
const variantsFor = (type: string) =>
  sectionVariants[type as keyof typeof sectionVariants] ?? [];

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}
function stringValue(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

export function SectionEditor({
  weddingId,
  section,
  media,
  onSaved,
  onClose,
}: Props) {
  const initial = asRecord(section.config);
  const initialMedia = asRecord(initial.media);
  const [config, setConfig] = useState<Record<string, unknown>>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const variants = variantsFor(section.type);
  const set = (key: string, value: unknown) => {
    setConfig(current => {
      const next = { ...current };

      if (
        key === "mediaId" &&
        typeof value === "string" &&
        value.trim() === ""
      ) {
        delete next.mediaId;
        return next;
      }

      next[key] = value;
      return next;
    });
  };
  const variant = stringValue(config.variant, variants[0]?.id ?? "default");

  const timelineItems = useMemo<TimelineItem[]>(
    () =>
      Array.isArray(config.items)
        ? config.items.map(item => {
            const x = asRecord(item);
            return {
              title: stringValue(x.title),
              description: stringValue(x.description),
              date: stringValue(x.date),
              mediaId: stringValue(x.mediaId),
            };
          })
        : [],
    [config.items],
  );
  const faqItems = useMemo<FaqItem[]>(
    () =>
      Array.isArray(config.items)
        ? config.items.map(item => {
            const x = asRecord(item);
            return {
              question: stringValue(x.question),
              answer: stringValue(x.answer),
            };
          })
        : [],
    [config.items],
  );

  async function save() {
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/sections/${section.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config }),
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(data?.error ?? "No se pudo guardar la configuración");
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  function updateTimeline(
    index: number,
    key: keyof TimelineItem,
    value: string,
  ) {
    const next = [...timelineItems];
    next[index] = { ...next[index], [key]: value };
    set("items", next);
  }
  function updateFaq(index: number, key: keyof FaqItem, value: string) {
    const next = [...faqItems];
    next[index] = { ...next[index], [key]: value };
    set("items", next);
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Editar {section.type}
          </h3>
          <p className="text-xs text-slate-500">
            Los cambios se guardan en la configuración de esta boda.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Cerrar
        </button>
      </div>

      {variants.length > 0 && (
        <div className="mb-5">
          <label className={labelClass}>Variante</label>
          <select
            className={selectClass}
            value={variant}
            onChange={e => set("variant", e.target.value)}
          >
            {variants.map(v => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {section.type === "HERO" && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Título</label>
            <input
              className={fieldClass}
              value={stringValue(config.title)}
              onChange={e => set("title", e.target.value)}
              placeholder="Nacho & Agus"
            />
          </div>
          <div>
            <label className={labelClass}>Subtítulo</label>
            <input
              className={fieldClass}
              value={stringValue(config.subtitle)}
              onChange={e => set("subtitle", e.target.value)}
              placeholder="Nos casamos"
            />
          </div>
          <div>
            <label className={labelClass}>Fecha mostrada</label>
            <input
              className={fieldClass}
              value={stringValue(config.date)}
              onChange={e => set("date", e.target.value)}
              placeholder="16.01.27"
            />
          </div>
          <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
            <input
              type="checkbox"
              checked={config.showDate !== false}
              onChange={e => set("showDate", e.target.checked)}
              className="h-4 w-4"
            />{" "}
            Mostrar fecha
          </label>
          <MediaSelector
            media={media}
            value={stringValue(config.mediaId)}
            onChange={v => set("mediaId", v)}
            label="Imagen principal"
          />
        </div>
      )}

      {section.type === "COUNTDOWN" && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Título</label>
            <input
              className={fieldClass}
              value={stringValue(config.title)}
              onChange={e => set("title", e.target.value)}
              placeholder="Falta muy poquito"
            />
          </div>
          <div>
            <label className={labelClass}>Fecha y hora objetivo</label>
            <input
              type="datetime-local"
              className={fieldClass}
              value={stringValue(config.targetDate).slice(0, 16)}
              onChange={e =>
                set(
                  "targetDate",
                  e.target.value ? new Date(e.target.value).toISOString() : "",
                )
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                ["showDays", "Días"],
                ["showHours", "Horas"],
                ["showMinutes", "Minutos"],
                ["showSeconds", "Segundos"],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium"
              >
                <input
                  type="checkbox"
                  checked={config[key] !== false}
                  onChange={e => set(key, e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}

      {(section.type === "EVENTS" ||
        section.type === "GALLERY" ||
        section.type === "RSVP" ||
        section.type === "GIFTS") && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <p className="font-semibold">
            Esta sección consume datos de su módulo.
          </p>
          <p className="mt-1">
            {section.type === "EVENTS"
              ? "Administrá los eventos desde Eventos."
              : section.type === "GALLERY"
                ? "Las imágenes se administran desde Media."
                : section.type === "RSVP"
                  ? "Las preguntas y respuestas se administran desde RSVP y Configuración."
                  : "Los regalos se administran desde Regalos y Configuración."}
          </p>
        </div>
      )}

      {section.type === "ILLUSTRATION" && (
        <div className="space-y-5">
          <MediaSelector
            media={media}
            value={stringValue(config.mediaId)}
            onChange={v => set("mediaId", v)}
            label="Ilustración"
          />
          <div>
            <label className={labelClass}>Texto alternativo</label>
            <input
              className={fieldClass}
              value={stringValue(config.alt)}
              onChange={e => set("alt", e.target.value)}
            />
          </div>
        </div>
      )}

      {section.type === "TEXT" && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Texto</label>
            <textarea
              className={fieldClass}
              rows={6}
              value={stringValue(config.text)}
              onChange={e => set("text", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Alineación</label>
            <select
              className={selectClass}
              value={stringValue(config.align, "center")}
              onChange={e => set("align", e.target.value)}
            >
              <option value="left">Izquierda</option>
              <option value="center">Centro</option>
              <option value="right">Derecha</option>
            </select>
          </div>
        </div>
      )}

      {section.type === "QUOTE" && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Frase</label>
            <textarea
              className={fieldClass}
              rows={4}
              value={stringValue(config.text)}
              onChange={e => set("text", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Autor</label>
            <input
              className={fieldClass}
              value={stringValue(config.author)}
              onChange={e => set("author", e.target.value)}
            />
          </div>
        </div>
      )}

      {section.type === "FAQ" && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Título</label>
            <input
              className={fieldClass}
              value={stringValue(config.title, "Preguntas Frecuentes")}
              onChange={e => set("title", e.target.value)}
            />
          </div>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="flex justify-between gap-3">
                  <span className="text-sm font-bold text-slate-700">
                    Pregunta {i + 1}
                  </span>
                  <button
                    type="button"
                    className="text-sm font-semibold text-red-600"
                    onClick={() =>
                      set(
                        "items",
                        faqItems.filter((_, j) => j !== i),
                      )
                    }
                  >
                    Eliminar
                  </button>
                </div>
                <input
                  className={fieldClass}
                  value={item.question}
                  onChange={e => updateFaq(i, "question", e.target.value)}
                  placeholder="¿Qué pasa si llueve?"
                />
                <textarea
                  className={fieldClass}
                  rows={3}
                  value={item.answer}
                  onChange={e => updateFaq(i, "answer", e.target.value)}
                  placeholder="Respuesta"
                />
              </div>
            ))}
            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
              onClick={() =>
                set("items", [...faqItems, { question: "", answer: "" }])
              }
            >
              + Agregar pregunta
            </button>
          </div>
        </div>
      )}

      {section.type === "TIMELINE" && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Título</label>
            <input
              className={fieldClass}
              value={stringValue(config.title, "Nuestra Historia")}
              onChange={e => set("title", e.target.value)}
            />
          </div>
          <div className="space-y-3">
            {timelineItems.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="flex justify-between gap-3">
                  <span className="text-sm font-bold text-slate-700">
                    Momento {i + 1}
                  </span>
                  <button
                    type="button"
                    className="text-sm font-semibold text-red-600"
                    onClick={() =>
                      set(
                        "items",
                        timelineItems.filter((_, j) => j !== i),
                      )
                    }
                  >
                    Eliminar
                  </button>
                </div>
                <input
                  className={fieldClass}
                  value={item.title}
                  onChange={e => updateTimeline(i, "title", e.target.value)}
                  placeholder="Nos conocimos"
                />
                <input
                  className={fieldClass}
                  value={item.date}
                  onChange={e => updateTimeline(i, "date", e.target.value)}
                  placeholder="Fecha opcional"
                />
                <textarea
                  className={fieldClass}
                  rows={2}
                  value={item.description}
                  onChange={e =>
                    updateTimeline(i, "description", e.target.value)
                  }
                  placeholder="Descripción opcional"
                />
                <MediaSelector
                  media={media}
                  value={item.mediaId}
                  onChange={v => updateTimeline(i, "mediaId", v)}
                  label="Imagen opcional"
                />
              </div>
            ))}
            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
              onClick={() =>
                set("items", [
                  ...timelineItems,
                  { title: "", description: "", date: "", mediaId: "" },
                ])
              }
            >
              + Agregar momento
            </button>
          </div>
        </div>
      )}

      {section.type === "CUSTOM" && (
        <div className="space-y-5">
          <MediaSelector
            media={media}
            value={stringValue(initialMedia.top)}
            onChange={v => set("media", { ...initialMedia, top: v })}
            label="Imagen superior"
          />
          <MediaSelector
            media={media}
            value={stringValue(initialMedia.bottom)}
            onChange={v => set("media", { ...initialMedia, bottom: v })}
            label="Imagen inferior"
          />
        </div>
      )}

      {section.type === "FOOTER" && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
          El Footer base utiliza el contenido estándar de la invitación. La
          variante controla su presentación visual.
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar configuración"}
        </button>
      </div>
    </div>
  );
}
