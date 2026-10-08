import Image from "next/image";
import { DESIGN_01_ASSETS } from "../../utils/design-assets";

type Props = {
  config: {
    variant?: string;
  };
};

export function FooterBotanicalEditorial({}: Props) {
  return (
    <footer className="w-full overflow-hidden bg-(--design-01-background) text-(--design-01-dark)">
      <div className="flex w-full flex-col items-center">
        <div className="font-script text-3xl transform -rotate-6 mt-7 md:text-5xl">
         <p>Te esperamos!</p>
        </div>

        <div className="mt-6 mb-10 w-24 md:mt-10 md:mb-16 md:w-44">
          <Image
            src={DESIGN_01_ASSETS.desktop.logoLetras}
            alt="Logo"
            width={650}
            height={300}
            className="block h-auto w-full "
          />

        </div>
      </div>
    </footer>
  );
}