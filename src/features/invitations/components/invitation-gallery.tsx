import { createAdminClient } from "@/lib/supabase/admin";

type InvitationMedia = {
  id: string;
  path: string;
  type: string;
  alt: string | null;
};

type InvitationGalleryProps = {
  media: InvitationMedia[];
};

export function InvitationGallery({ media }: InvitationGalleryProps) {
  const supabase = createAdminClient();

  const images = media
    .filter(item => ["hero", "gallery", "illustration"].includes(item.type))
    .map(item => ({
      ...item,
      url: supabase.storage.from("wedding-media").getPublicUrl(item.path).data
        .publicUrl,
    }));

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">Nuestros momentos</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map(image => (
          <div key={image.id} className="overflow-hidden rounded-xl">
            <img
              src={image.url}
              alt={image.alt ?? ""}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
