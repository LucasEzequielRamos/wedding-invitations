import type { HeroConfig } from "../../schemas/hero.schema";
import { DESIGN_01_ASSETS } from "../../utils/design-assets";

type HeroMedia = {
  path: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

type Props = {
  config: HeroConfig;
  media: HeroMedia | null;
};

export function HeroBotanicalEditorial({ config }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--design-01-background)] text-[var(--design-01-dark)]">
      {/* Desktop */}
      <img
        src={DESIGN_01_ASSETS.desktop.topFlores}
        alt=""
        aria-hidden="true"
        className="hidden h-auto w-full md:block"
      />

      {/* Mobile */}
      <img
        src={DESIGN_01_ASSETS.mobile.topFlores}
        alt=""
        aria-hidden="true"
        className="block h-auto w-full md:hidden"
      />

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        {config.title && (
          <h1 className="font-script text-[clamp(2rem,3.4vw,3.25rem)] leading-none font-normal">
            {config.title}
          </h1>
        )}

        {config.showDate && config.date && (
          <p className="mt-4 font-script text-[clamp(1rem,1.5vw,1.4rem)] leading-none">
            {config.date}
          </p>
        )}
      </div>
    </section>
  );
}
