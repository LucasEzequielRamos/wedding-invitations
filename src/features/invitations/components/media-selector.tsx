"use client";

type MediaItem = {
  id: string;
  path: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

type Props = {
  media: MediaItem[];
  value: string;
  onChange: (mediaId: string) => void;
  label?: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function getPublicMediaUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/wedding-media/${path}`;
}

export function MediaSelector({
  media,
  value,
  onChange,
  label = "Seleccionar imagen",
}: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      {media.length === 0 ? (
        <p className="text-sm text-gray-500">No hay imágenes cargadas.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {media.map(item => {
            const selected = item.id === value;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                className={[
                  "relative overflow-hidden rounded-lg border-2 bg-white",
                  selected
                    ? "border-black"
                    : "border-transparent hover:border-gray-300",
                ].join(" ")}
              >
                <div className="aspect-square">
                  <img
                    src={getPublicMediaUrl(item.path)}
                    alt={item.alt ?? ""}
                    className="h-full w-full object-cover"
                  />
                </div>

                {selected && (
                  <div className="absolute right-2 top-2 rounded-full bg-black px-2 py-1 text-xs text-white">
                    ✓
                  </div>
                )}

                <div className="truncate px-2 py-2 text-left text-xs">
                  {item.alt || "Sin descripción"}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
