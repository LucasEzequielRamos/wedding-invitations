type InvitationGift = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  externalUrl: string | null;
  paymentUrl: string | null;
};

type InvitationGiftsProps = {
  gifts: InvitationGift[];
};

export function InvitationGifts({ gifts }: InvitationGiftsProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">Regalos</h2>

        <p className="mt-3 text-gray-500">
          Si desean hacernos un regalo, pueden hacerlo desde las siguientes
          opciones.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gifts.map(gift => (
          <article key={gift.id} className="rounded-xl border p-6">
            {gift.image && (
              <img
                src={gift.image}
                alt={gift.name}
                className="mb-4 aspect-square w-full rounded-lg object-cover"
              />
            )}

            <h3 className="text-xl font-semibold">{gift.name}</h3>

            {gift.description && (
              <p className="mt-2 text-sm text-gray-500">{gift.description}</p>
            )}

            <div className="mt-5 flex flex-col gap-2">
              {gift.externalUrl && (
                <a
                  href={gift.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border px-4 py-2 text-center text-sm font-medium"
                >
                  Ver regalo
                </a>
              )}

              {gift.paymentUrl && (
                <a
                  href={gift.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-black px-4 py-2 text-center text-sm font-medium text-white"
                >
                  Regalar
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
