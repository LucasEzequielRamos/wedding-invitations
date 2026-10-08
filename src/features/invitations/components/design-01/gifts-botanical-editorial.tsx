import Image from "next/image";
import { DESIGN_01_ASSETS } from "../../utils/design-assets";

type InvitationGift = {
  id: string;
  name: string;
  description: string | null;
  isVisible?: boolean;
};

type Props = {
  gifts: InvitationGift[];
};

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="size-5 shrink-0 md:size-7"
      fill="none"
    >
      <rect
        x="5"
        y="4"
        width="7"
        height="9"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M3 11V3.5C3 2.67 3.67 2 4.5 2H10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GiftsBotanicalEditorial({ gifts }: Props) {
  const visibleGifts = gifts.filter(
    (gift) => gift.isVisible !== false && gift.description,
  );

  return (
    <section className="w-full overflow-hidden bg-(--design-01-background) text-(--design-01-dark)">
      <div className="mx-auto flex w-full flex-col items-center">
        {/* Título */}
        <div className="mt-12 w-44 md:mt-20 md:w-64">
          <Image
            src={DESIGN_01_ASSETS.mobile.regalos}
            alt="Regalos"
            width={420}
            height={163}
            className="block h-auto w-full md:hidden"
          />

          <Image
            src={DESIGN_01_ASSETS.desktop.regalos}
            alt="Regalos"
            width={420}
            height={163}
            className="hidden h-auto w-full md:block"
          />
        </div>

        {/* Texto */}
        <p
          className="
            mt-2
            max-w-86
            text-center
            font-altivo
            text-xs
            leading-tight
            md:mt-3
            md:max-w-2xl
            md:text-xl
          "
        >
          Nuestro mayor deseo es poder compartir este día tan
          <br className="hidden md:block" />
          especial con ustedes, pero si desean hacernos un regalo
          <br className="hidden md:block" />
          pueden hacerlo de la siguiente manera:
        </p>

        {/* Datos */}
        <div
          className="
            mt-5
            flex
            flex-col
            gap-3
            font-altivo
            text-[0.5rem]
            md:mt-7
            md:gap-4
            md:text-sm
          "
        >
          {visibleGifts.map((gift) => (
            <div
              key={gift.id}
              className="flex items-center gap-2"
            >
              <CopyIcon />

              <span className="text-sm md:text-lg">
                <span className="text-sm md:text-lg">{gift.name}:</span>{" "}
                {gift.description}
              </span>
            </div>
          ))}
        </div>

        {/* Gracias */}
        <div className="mt-7 w-32 md:mt-10 md:w-64">
          <Image
            src={DESIGN_01_ASSETS.mobile.gracias}
            alt="En serio, gracias"
            width={420}
            height={163}
            className="block h-auto w-full md:hidden"
          />

          <Image
            src={DESIGN_01_ASSETS.desktop.gracias}
            alt="En serio, gracias"
            width={420}
            height={163}
            className="hidden h-auto w-full md:block"
          />
        </div>

        {/* Mesa */}
        <div className="mt-2 w-full md:mt-4">
          <Image
            src={DESIGN_01_ASSETS.mobile.mesa}
            alt=""
            aria-hidden="true"
            width={1138}
            height={725}
            className="block h-auto w-full md:hidden"
          />

          <Image
            src={DESIGN_01_ASSETS.desktop.mesa}
            alt=""
            aria-hidden="true"
            width={1138}
            height={725}
            className="hidden max-h-[600px] w-4/5 md:block"
          />
        </div>
      </div>
    </section>
  );
}