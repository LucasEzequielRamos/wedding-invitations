type InvitationHeroProps = {
  name: string;
  weddingDate: Date | null;
};

export function InvitationHero({ name, weddingDate }: InvitationHeroProps) {
  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6 py-20 text-center">
      <div>
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-500">
          Nuestra boda
        </p>

        <h1 className="text-5xl font-bold md:text-7xl">{name}</h1>

        {weddingDate && (
          <p className="mt-6 text-lg text-gray-600">
            {new Intl.DateTimeFormat("es-AR", {
              dateStyle: "long",
            }).format(weddingDate)}
          </p>
        )}
      </div>
    </section>
  );
}
