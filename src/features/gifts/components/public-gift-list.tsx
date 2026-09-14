"use client";

import { useEffect, useState } from "react";

type Gift = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  externalUrl: string | null;
  paymentUrl: string | null;
  sortOrder: number;
};

type Props = {
  slug: string;
};

export function PublicGiftList({ slug }: Props) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGifts() {
      try {
        const response = await fetch(`/api/invitacion/${slug}/gifts`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "No se pudieron cargar los regalos");
        }

        setGifts(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Ocurrió un error");
      } finally {
        setLoading(false);
      }
    }

    loadGifts();
  }, [slug]);

  if (loading) {
    return <p>Cargando regalos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (gifts.length === 0) {
    return null;
  }

  return (
    <section>
      <h2>Regalos</h2>

      <div>
        {gifts.map(gift => (
          <article key={gift.id}>
            {gift.image && <img src={gift.image} alt={gift.name} />}

            <h3>{gift.name}</h3>

            {gift.description && <p>{gift.description}</p>}

            <div>
              {gift.externalUrl && (
                <a
                  href={gift.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver regalo
                </a>
              )}

              {gift.paymentUrl && (
                <a
                  href={gift.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hacer aporte
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
