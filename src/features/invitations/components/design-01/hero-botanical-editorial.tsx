/* eslint-disable @next/next/no-img-element */
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
    <section className="relative w-full overflow-hidden bg-[#FDF6DC] text-[#283517]">
      {/* =========================
          DESKTOP
      ========================== */}
      <div className="relative hidden h-137.5 w-full md:block">
        <img
          src={DESIGN_01_ASSETS.desktop.topFlores}
          alt=""
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-auto w-full"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-start pt-87.5 text-center">
          {config.title && (
            <h1 className="font-script text-[clamp(5rem,4vw,4.5rem)] font-normal leading-none">
              {config.title}
            </h1>
          )}

          {config.showDate && config.date && (
            <p className="mt-5 font-script text-[clamp(3.15rem,1.5vw,1.7rem)] leading-none pt-10">
              {config.date}
            </p>
          )}
        </div>
      </div>

      {/* =========================
          MOBILE
      ========================== */}
      <div className="relative block h-55 w-full md:hidden">
        <img
          src={DESIGN_01_ASSETS.mobile.topFlores}
          alt=""
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-auto w-full"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-start pt-30 text-center">
          {config.title && (
            <h1 className="font-script text-[clamp(2rem,9vw,3rem)] font-normal leading-none">
              {config.title}
            </h1>
          )}

          {config.showDate && config.date && (
            <p className="mt-4 font-script text-[clamp(0.95rem,4.5vw,1.3rem)] leading-none">
              {config.date}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
