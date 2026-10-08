import Image from "next/image";
import { DESIGN_01_ASSETS } from "../../utils/design-assets";

export function StoryBotanicalEditorial() {
  return (
    <section className="w-full overflow-hidden bg-(--design-01-background) mt-60 mx-auto px-6">
      <Image
        src={DESIGN_01_ASSETS.desktop.timeline}
        alt="Nuestra historia"
        width={1200}
        height={1800}
        className="hidden h-auto w-3/5 mx-auto md:block px-28"
      />

      <Image
        src={DESIGN_01_ASSETS.desktop.timeline}
        alt="Nuestra historia"
        width={650}
        height={1800}
        className="block h-auto w-full md:hidden"
      />
    </section>
  );
}