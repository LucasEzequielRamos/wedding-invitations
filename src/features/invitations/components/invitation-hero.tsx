import { HeroBotanicalEditorial } from "./design-01/hero-botanical-editorial";
import type { HeroConfig } from "../schemas/hero.schema";

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

export function InvitationHero({ config, media }: Props) {
  switch (config.variant) {
    case "botanical-editorial":
      return <HeroBotanicalEditorial config={config} media={media} />;

    default:
      return <HeroBotanicalEditorial config={config} media={media} />;
  }
}
