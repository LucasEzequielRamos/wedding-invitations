"use client";

import { useState } from "react";

type Media = {
  id: string;
  path: string;
  type: string;
  alt: string | null;
  sortOrder: number;
};

type Props = {
  weddingId: string;
  initialMedia: Media[];
};

const BUCKET = "wedding-media";

export function MediaManager({ weddingId, initialMedia }: Props) {
  const [media, setMedia] = useState(initialMedia);

  const [file, setFile] = useState<File | null>(null);

  const [type, setType] = useState("gallery");

  const [alt, setAlt] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  function getPublicUrl(path: string) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      setError("Seleccioná una imagen");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("type", type);
      formData.append("alt", alt);
      formData.append("sortOrder", String(media.length));

      const response = await fetch(
        `/api/dashboard/weddings/${weddingId}/media`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo subir la imagen");
      }

      setMedia(current => [...current, data]);

      setFile(null);
      setAlt("");

      const input = document.getElementById(
        "media-file",
      ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(mediaId: string) {
    if (!window.confirm("¿Eliminar esta imagen?")) {
      return;
    }

    const response = await fetch(
      `/api/dashboard/weddings/${weddingId}/media/${mediaId}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.error ?? "No se pudo eliminar la imagen");

      return;
    }

    setMedia(current => current.filter(item => item.id !== mediaId));
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Multimedia</h1>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          id="media-file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
        />

        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="hero">Portada</option>

          <option value="gallery">Galería</option>

          <option value="illustration">Ilustración</option>

          <option value="other">Otro</option>
        </select>

        <input
          value={alt}
          onChange={e => setAlt(e.target.value)}
          placeholder="Texto alternativo"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Subiendo..." : "Subir imagen"}
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {media.map(item => (
          <article key={item.id}>
            <img
              src={getPublicUrl(item.path)}
              alt={item.alt ?? ""}
              className="aspect-square w-full object-cover"
            />

            <p>{item.type}</p>

            <button onClick={() => handleDelete(item.id)}>Eliminar</button>
          </article>
        ))}
      </div>
    </div>
  );
}
