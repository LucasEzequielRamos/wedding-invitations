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
type Media = {
  id: string;
  path: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  type?: string;
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
  TIMELINE: "Nuestra historia",
  FAQ: "Preguntas frecuentes",
  FOOTER: "Footer",
  CUSTOM: "Personalizada",
};
const sectionTypes = Object.keys(sectionLabels);

function defaultConfig(type: string) {
  switch (type) {
    case "HERO":
      return {
        variant: "botanical-editorial",
        title: "",
        subtitle: "",
        date: "",
        showDate: true,
        mediaId: "",
      };
    case "COUNTDOWN":
      return {
        variant: "botanical-editorial",
        title: "",
        targetDate: "",
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
      };
    case "EVENTS":
      return { variant: "botanical-editorial" };
    case "GALLERY":
      return { variant: "botanical-editorial" };
    case "RSVP":
      return { variant: "botanical-editorial" };
    case "GIFTS":
      return { variant: "botanical-editorial" };
    case "FAQ":
      return {
        variant: "botanical-editorial",
        title: "Preguntas Frecuentes",
        items: [],
      };
    case "TIMELINE":
      return {
        variant: "botanical-editorial",
        title: "Nuestra Historia",
        items: [],
      };
    case "ILLUSTRATION":
      return { variant: "default", mediaId: "", alt: "" };
    case "TEXT":
      return { variant: "default", text: "", align: "center" };
    case "QUOTE":
      return { variant: "default", text: "", author: "" };
    case "FOOTER":
      return { variant: "botanical-editorial" };
    case "CUSTOM":
      return { variant: "romantic-floral", media: { top: "", bottom: "" } };
    default:
      return {};
  }
}

export default function InvitationSectionsPage() {
  const params = useParams();
  const weddingId = params.id as string;
  const [sections, setSections] = useState<Section[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("HERO");
  const [adding, setAdding] = useState(false);
  async function load() {
    try {
      const [w, s, m] = await Promise.all([
        fetch(`/api/dashboard/weddings/${weddingId}`),
        fetch(`/api/dashboard/weddings/${weddingId}/sections`),
        fetch(`/api/dashboard/weddings/${weddingId}/media`),
      ]);
      if (w.ok) {
        const wd = await w.json();
        setSlug(wd.slug || "");
      }
      if (!s.ok) throw new Error("No se pudieron cargar las secciones");
      setSections(await s.json());
      if (m.ok) setMedia(await m.json());
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [weddingId]);
  async function addSection() {
    setMessage("");
    setAdding(true);
    try {
      const r = await fetch(`/api/dashboard/weddings/${weddingId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          enabled: true,
          config: defaultConfig(selectedType),
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "No se pudo crear");
      await load();
      setEditing(d.id);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error al crear");
    } finally {
      setAdding(false);
    }
  }
  async function toggle(s: Section) {
    const r = await fetch(
      `/api/dashboard/weddings/${weddingId}/sections/${s.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !s.enabled }),
      },
    );
    if (!r.ok) setMessage("No se pudo actualizar");
    else await load();
  }
  async function remove(id: string) {
    if (!confirm("¿Eliminar esta sección?")) return;
    const r = await fetch(
      `/api/dashboard/weddings/${weddingId}/sections/${id}`,
      { method: "DELETE" },
    );
    if (!r.ok) setMessage("No se pudo eliminar");
    else {
      setEditing(null);
      await load();
    }
  }
  async function move(index: number, direction: -1 | 1) {
    const ni = index + direction;
    if (ni < 0 || ni >= sections.length) return;
    const next = [...sections];
    const [x] = next.splice(index, 1);
    next.splice(ni, 0, x);
    setSections(next);
    const r = await fetch(
      `/api/dashboard/weddings/${weddingId}/sections/reorder`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionIds: next.map(x => x.id) }),
      },
    );
    if (!r.ok) {
      setMessage("No se pudo guardar el orden");
      await load();
    }
  }
  if (loading)
    return (
      <main className="min-h-screen p-6 text-slate-900">
        Cargando diseño...
      </main>
    );
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Diseño de la invitación
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Creá, configurá, activá y ordená las secciones. Los datos
                propios de Eventos, Media, RSVP y Regalos siguen administrándose
                en sus módulos.
              </p>
            </div>
            {slug && (
              <a
                href={`/invitacion/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
              >
                Ver invitación ↗
              </a>
            )}
          </div>
        </header>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="text-sm font-semibold text-slate-800">
                Nueva sección
              </label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900"
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
              >
                {sectionTypes.map(t => (
                  <option key={t} value={t}>
                    {sectionLabels[t]}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              disabled={adding}
              onClick={addSection}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {adding ? "Creando..." : "+ Agregar sección"}
            </button>
          </div>
        </section>
        {message && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {message}
          </div>
        )}
        <section className="space-y-3">
          {sections.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Todavía no hay secciones.
            </div>
          ) : (
            sections.map((s, i) => (
              <div key={s.id}>
                <article
                  className={`rounded-xl border bg-white p-4 shadow-sm ${s.enabled ? "border-slate-200" : "border-slate-300 opacity-70"}`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        className="rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-700 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, 1)}
                        disabled={i === sections.length - 1}
                        className="rounded-md border border-slate-300 px-2.5 py-1.5 text-slate-700 disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900">
                        {sectionLabels[s.type] ?? s.type}
                      </p>
                      <p className="text-xs text-slate-500">
                        {s.type} · posición {i + 1}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(s)}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold ${s.enabled ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-300 bg-slate-100 text-slate-600"}`}
                    >
                      {s.enabled ? "Activo" : "Desactivado"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(editing === s.id ? null : s.id)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      {editing === s.id ? "Cerrar" : "Editar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(s.id)}
                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
                {editing === s.id && (
                  <SectionEditor
                    weddingId={weddingId}
                    section={s}
                    media={media}
                    onSaved={async () => {
                      await load();
                      setMessage("Configuración guardada");
                    }}
                    onClose={() => setEditing(null)}
                  />
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
