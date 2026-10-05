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

export function GiftsBotanicalEditorial({ gifts }: InvitationGiftsProps) {
  if (!gifts.length) {
    return null;
  }

  return (
    <section className="bg-[#FDF6DC] px-6 py-16 text-[#283517]">
      <div className="mx-auto max-w-[800px]">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Regalos</h2>

          <p className="mx-auto mt-4 max-w-xl">
            Si desean hacernos un regalo, pueden hacerlo desde las siguientes
            opciones.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {gifts.map(gift => (
            <article
              key={gift.id}
              className="rounded-2xl border border-[#566B30]/30 bg-[#FDF6DC] p-6"
            >
              {gift.image && (
                <img
                  src={gift.image}
                  alt={gift.name}
                  className="mx-auto mb-5 max-h-64 w-full object-contain"
                />
              )}

              <h3 className="text-xl font-medium">{gift.name}</h3>

              {gift.description && (
                <p className="mt-2 text-sm">{gift.description}</p>
              )}

              <div className="mt-5 flex flex-col gap-3">
                {gift.externalUrl && (
                  <a
                    href={gift.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-[#566B30] px-5 py-3 text-center text-sm"
                  >
                    Ver regalo
                  </a>
                )}

                {gift.paymentUrl && (
                  <a
                    href={gift.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#566B30] px-5 py-3 text-center text-sm text-white"
                  >
                    Regalar
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
