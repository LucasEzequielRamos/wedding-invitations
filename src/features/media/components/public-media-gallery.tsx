"use client";

import { useEffect, useState } from "react";

type Media = {
  id: string;
  url: string;
  type: string;
  alt: string | null;
  sortOrder: number;
};

type Props = {
  slug: string;
  type?: string;
};

export function PublicMediaGallery({ slug, type = "gallery" }: Props) {
  const [media, setMedia] = useState<Media[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMedia() {
      try {
        const response = await fetch(`/api/invitacion/${slug}/media`);

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setMedia(data.filter((item: Media) => item.type === type));
      } finally {
        setLoading(false);
      }
    }

    loadMedia();
  }, [slug, type]);

  if (loading || media.length === 0) {
    return null;
  }

  return (
    <section>
      <h2>Galería</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {media.map(item => (
          <img
            key={item.id}
            src={item.url}
            alt={item.alt ?? ""}
            loading="lazy"
            className="w-full object-cover"
          />
        ))}
      </div>
    </section>
  );
}
