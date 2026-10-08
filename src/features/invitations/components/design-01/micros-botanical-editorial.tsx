"use client";

import Image from "next/image";
import { useState } from "react";
import { DESIGN_01_ASSETS } from "../../utils/design-assets";

type Props = {
  onSubmit?: (data: {
    stop: "OBELISCO" | "LANUS";
    fullName: string;
    phone: string;
  }) => void;
};

export function MicrosBotanicalEditorial({ onSubmit }: Props) {
  const [stop, setStop] = useState<"OBELISCO" | "LANUS">("OBELISCO");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  function submit() {
    onSubmit?.({
      stop,
      fullName,
      phone,
    });
  }

  return (
    <section className="w-full  bg-(--design-01-background) text-(--design-01-dark)">
      <div className="relative mx-auto w-full mt-24">
        {/* Decoración + título */}
        <Image
          src={DESIGN_01_ASSETS.desktop.micros}
          alt=""
          aria-hidden="true"
          width={1339}
          height={613}
          className="hidden h-auto w-[70%] mx-auto md:block"
        />

        <Image
          src={DESIGN_01_ASSETS.mobile.micros}
          alt=""
          aria-hidden="true"
          width={368}
          height={168}
          className="block h-auto w-full  md:hidden"
        />

        {/* Formulario */}
        <div
          className="
            absolute
            top-[35%]
            left-1/2
            -translate-x-1/2
            mx-auto
            -mt-2
            flex
            w-[55%]
            max-w-md
            flex-col
            items-center
            px-6
            md:absolute
            md:top-[40%]
            md:left-1/2
            md:-translate-x-1/2
            md:px-0
          "
        >
          <p
            className="
              max-w-xs
              text-center
              font-altivo
              text-[0.55rem]
              leading-tight
              md:max-w-xl
              md:w-xl
              md:text-lg
            "
          >
            Dispondremos de viajes en combi ida y vuelta para que solo te
            preocupes por el outfit!
          </p>

          {/* Paradas */}
          <div
            className="
              mt-4
              flex
              items-center
              justify-center
              gap-6
              font-script
              text-sm
              md:mt-7
              md:gap-12
              md:text-xl
            "
          >
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="stop"
                value="OBELISCO"
                checked={stop === "OBELISCO"}
                onChange={() => setStop("OBELISCO")}
                className="
                  size-3
                  appearance-none
                  rounded-full
                  border-2
                  border-(--design-01-primary)
                  bg-(--design-01-background)
                  checked:bg-(--design-01-primary)
                  md:size-4
                "
              />
              <span>Parada Obelisco</span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="stop"
                value="LANUS"
                checked={stop === "LANUS"}
                onChange={() => setStop("LANUS")}
                className="
                  size-3
                  appearance-none
                  rounded-full
                  border-2
                  border-(--design-01-primary)
                  bg-(--design-01-background)
                  checked:bg-(--design-01-primary)
                  md:size-4
                "
              />
              <span>Parada Lanús</span>
            </label>
          </div>

          {/* Inputs */}
          <div
            className="
              mt-4
              flex
              w-full
              flex-col
              gap-2
              md:mt-6
              md:gap-3
            "
          >
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Nombre completo"
              className="
                h-9
                w-full
                rounded-full
                border-0
                bg-(--design-01-primary)
                px-5
                font-script
                text-sm
                text-(--design-01-white)
                outline-none
                placeholder:text-(--design-01-white)
                md:h-12
                md:px-8
                md:text-xl
              "
            />

            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Teléfono"
              className="
                h-9
                w-full
                rounded-full
                border-0
                bg-(--design-01-primary)
                px-5
                font-script
                text-sm
                text-(--design-01-white)
                outline-none
                placeholder:text-(--design-01-white)
                md:h-12
                md:px-8
                md:text-xl
              "
            />
          </div>

          {/* Botón */}
          <button
            type="button"
            onClick={submit}
            className="
              mt-4
              rounded-full
              bg-(--design-01-dark)
              px-8
              py-2
              font-script
              text-sm
              text-(--design-01-white)
              md:mt-6
              md:px-12
              md:py-3
              md:text-xl
            "
          >
            Confirmar Viaje
          </button>

          {/* Texto inferior */}
          <div
            className="
              mt-5
              max-w-xs
              text-center
              font-altivo
              text-[0.55rem]
              leading-tight
              md:mt-8
              md:max-w-lg
              md:text-lg
            "
          >
            <p>
              Elegí la parada que más te convenga y nosotros nos
              comunicaremos con vos para arreglar el resto!
            </p>

            <p className="mt-4 font-medium md:mt-6">
              PODES LLENAR EL FORMULARIO HASTA EL 30/12
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}