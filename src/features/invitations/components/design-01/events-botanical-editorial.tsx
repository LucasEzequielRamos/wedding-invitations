import Image from "next/image";

import { DESIGN_01_ASSETS } from "../../utils/design-assets";

type InvitationEvent = {
  id: string;
  name: string;
  date: Date | string;
  location: string | null;
  address: string | null;
  mapsUrl: string | null;
};

type Props = {
  events: InvitationEvent[];
};

function formatTime(date: Date | string) {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(date));
}

export function EventsBotanicalEditorial({ events }: Props) {
  if (!events.length) {
    return null;
  }

  return (
    <section className="w-full bg-(--design-01-background) py-12 text-(--design-01-dark) md:py-16">
      <div className="mx-auto w-full max-w-6xl">
        {events.map(event => (
          <article
            key={event.id}
            className="flex flex-col items-center text-center"
          >
            {/* Imagen */}
            <picture className="block w-full">
              <source
                media="(max-width: 767px)"
                srcSet={DESIGN_01_ASSETS.desktop.casa}
              />

              <Image
                src={DESIGN_01_ASSETS.desktop.casa}
                alt=""
                aria-hidden="true"
                width={1200}
                height={700}
                sizes="100vw"
                className="h-auto w-full"
              />
            </picture>

            <h2 className="mt-8 max-w-full px-6 font-script text-2xl font-normal  md:max-w-4xl md:text-6xl">
              {event.name}
            </h2>

            {/* Hora */}
            <p className="mt-4 font-script text-lg md:text-4xl">
              {formatTime(event.date)}hs
            </p>

            {/* Ubicación */}
            {event.location && (
              <p className="mt-4 px-6 font-altivo text-base md:text-lg">
                {event.location}
              </p>
            )}

            {event.address && (
              <p className="mt-1 max-w-xl px-6 text-sm opacity-80">
                {event.address}
              </p>
            )}

            {/* Navegación */}
            {event.mapsUrl && (
              <div className="relative mt-8 flex w-full min-h-24 flex-col items-center px-6 md:mt-10">
                {/* Flecha mobile */}
                <div className="flex md:hidden  absolute bottom-0 left-1/2 -translate-x-24 translate-y-5">
                  <Image
                    src={DESIGN_01_ASSETS.mobile.flechaMaps}
                    alt=""
                    aria-hidden="true"
                    width={220}
                    height={160}
                    className="h-auto w-10 object-contain"
                  />
                </div>

                {/* Botón */}
                <a
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 inline-flex items-center justify-center rounded-full border-2 border-(--design-01-primary) bg-(--design-01-primary) px-8 py-3 font-altivo text-sm md:text-2xl uppercase tracking-[0.08em] text-(--design-01-white)"
                >
                  ¿Cómo llegar?
                </a>

                {/* Flecha desktop */}
                <div className="pointer-events-none absolute bottom-0 right-1/2 hidden -translate-x-36 translate-y-16 md:block">
                  <Image
                    src={DESIGN_01_ASSETS.desktop.flechaMaps}
                    alt=""
                    aria-hidden="true"
                    width={256}
                    height={160}
                    className="h-auto w-24 object-contain"
                  />
                </div>

                {/* Texto */}
                <p className="mt-4 font-altivo text-xl md:mt-8 md:text-2xl absolute bottom-0 right-1/2 -translate-x-4 translate-y-20 md:translate-y-34 md:-translate-x-30 text-[--design-01-dark]">
                  Te llevamos <br /> con Maps!
                </p>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
