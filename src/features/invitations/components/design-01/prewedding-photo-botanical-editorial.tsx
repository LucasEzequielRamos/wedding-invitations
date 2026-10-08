import Image from "next/image";
import { DESIGN_01_ASSETS } from "../../utils/design-assets";

export function PreweddingPhotoBotanicalEditorial() {
  return (
    <section className="w-full overflow-hidden bg-(--design-01-background) mt-24">
      <Image
        src={DESIGN_01_ASSETS.desktop.fotoPreboda}
        alt="Foto preboda"
        width={1200}
        height={900}
        className="hidden h-auto w-1/2 mx-auto md:block px-24"
      />

      <Image
        src={DESIGN_01_ASSETS.desktop.fotoPreboda}
        alt="Foto preboda"
        width={650}
        height={900}
        className="block h-auto w-full md:hidden"
      />
    </section>
  );
}