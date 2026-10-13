"use client";

import { DESIGN_01_ASSETS } from "@/features/invitations/utils/design-assets";
import { useState } from "react";

type BusStopOption = {
  id: string;
  name: string;
  address: string | null;
  busName: string;
};

type RsvpData = {
  weddingId: string;
  guestId: string;
  guestName: string;
  busesEnabled: boolean;
  stops: BusStopOption[];
  needsBus: boolean;
  busStopId: string | null;
};

type Props = {
  slug: string;
};

export function PublicRsvpForm({ slug }: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [status, setStatus] = useState<
    "ATTENDING" | "NOT_ATTENDING" | ""
  >("");

  const [rsvp, setRsvp] = useState<RsvpData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  

 async function searchGuest(): Promise<RsvpData | null> {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length < 2) {
    setMessage("Ingresá tu nombre completo.");
    return null;
  }

  setLoading(true);
  setMessage("");

  try {
    const response = await fetch(`/api/invitacion/${slug}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: parts[0],
        lastName: parts.slice(1).join(" "),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "No encontramos tu invitación.");
      return null;
    }

    setRsvp(data);
    return data;
  } catch {
    setMessage("Ocurrió un error. Intentá nuevamente.");
    return null;
  } finally {
    setLoading(false);
  }
}

async function submit() {
  if (!status) {
    setMessage("Por favor, elegí una opción de asistencia.");
    return;
  }

  if (!fullName.trim()) {
    setMessage("Ingresá tu nombre completo.");
    return;
  }

  setLoading(true);
  setMessage("");

  try {
    // Usa el invitado ya encontrado o lo busca ahora.
    const guest = rsvp ?? await searchGuest();

    if (!guest) return;

    const response = await fetch(
      `/api/invitacion/${slug}/rsvp/submit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weddingId: guest.weddingId,
          guestId: guest.guestId,
          status,
          answers: [],
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "No pudimos guardar tu respuesta.");
      return;
    }
    
    setMessage("¡Gracias por confirmar!");
    setFullName("");
    setPhone("");
    setRsvp(null);
    setStatus("");
  } catch {
    setMessage("Ocurrió un error. Intentá nuevamente.");
  } finally {
    setLoading(false);
  }
}

  return (
    <div
      className="
      -mt-5
        flex
        w-full
        max-w-3xl
        flex-col
        items-center
        justify-center
        px-6
        text-(--design-01-dark)
      "
    >
      {/* Título */}
     <img src={DESIGN_01_ASSETS.desktop.teVemos} alt="¿Te vemos?" className="w-full max-w-md hidden md:block -pt-10" />
     <img src={DESIGN_01_ASSETS.mobile.teVemos} alt="¿Te vemos?" className="w-full max-w-45 pt-10  md:hidden " />

      {/* Asistencia */}
      <div
        className="
          mt-3
          flex
          w-full
          justify-center
          gap-5
          md:mt-5
          md:gap-10
        "
      >
        <label
          className="
            flex
            cursor-pointer
            items-center
            gap-1.5
            font-script
            text-sm
            md:gap-2
            md:text-xl
          "
        >
          <input
            type="radio"
            name="attendance"
            value="ATTENDING"
            checked={status === "ATTENDING"}
            onChange={() => setStatus("ATTENDING")}
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

          <span>Sí, nos vemos!</span>
        </label>

        <label
          className="
            flex
            cursor-pointer
            items-center
            gap-1.5
            font-script
            text-sm
            md:gap-2
            md:text-xl
          "
        >
          <input
            type="radio"
            name="attendance"
            value="NOT_ATTENDING"
            checked={status === "NOT_ATTENDING"}
            onChange={() => setStatus("NOT_ATTENDING")}
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

          <span>No, me lo pierdo!</span>
        </label>
      </div>

      {/* Inputs */}
      <div
        className="
          mt-3
          flex
          w-9/12
          max-w-2xl
          flex-col
          gap-2
          md:mt-6
          md:gap-3
        "
      >
        <input
          type="text"
          value={fullName}
          onChange={(event) =>{ setFullName(event.target.value);
          setRsvp(null)}
          }
          placeholder="Nombre completo"
          className="
            h-8
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
          placeholder="Telefono"
          className="
            h-8
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
        disabled={loading}
        className="
          mt-3
          rounded-full
          bg-(--design-01-dark)
          px-8
          py-1
          font-script
          text-sm
          text-(--design-01-white)
          transition-opacity
          disabled:opacity-50
          md:mt-5
          md:px-12
          md:py-3
          md:text-xl
        "
      >
        {loading ? "Confirmando..." : "Confirmar asistencia"}
      </button>

      <div className="mt-2 flex min-h-12 w-full items-start justify-center px-2 md:min-h-6">

    {message ? (
      <p className="text-center font-altivo text-[0.6rem] leading-relaxed md:text-xs max-w-[80%]">
        {message}
    </p>
  ): (<p
        className="
          
          max-w-xs
          text-center
          font-altivo
          text-[0.55rem]
          leading-tight
          text-(--design-01-dark)
          md:mt-5
          md:max-w-lg
          md:text-sm
        "
      >
        Recordá llenar el formulario por persona,
        <br />
        tenés tiempo hasta el 30/12
      </p>)}
</div>
    </div>
  );
}