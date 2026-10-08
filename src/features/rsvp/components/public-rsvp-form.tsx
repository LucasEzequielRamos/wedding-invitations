"use client";

import { DESIGN_01_ASSETS } from "@/features/invitations/utils/design-assets";
import { useState } from "react";

type RsvpData = {
  weddingId: string;
  guestId: string;
  guestName: string;
};

type Props = {
  slug: string;
};

export function PublicRsvpForm({ slug }: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [status, setStatus] = useState<
    "ATTENDING" | "NOT_ATTENDING"
  >("ATTENDING");

  const [rsvp, setRsvp] = useState<RsvpData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function searchGuest() {
    setLoading(true);
    setMessage("");

    const parts = fullName.trim().split(/\s+/);

    if (parts.length < 2) {
      setMessage("Ingresá tu nombre completo.");
      setLoading(false);
      return;
    }

    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");

    try {
      const response = await fetch(`/api/invitacion/${slug}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "No encontramos tu invitación.");
        return;
      }

      setRsvp(data);
    } catch {
      setMessage("Ocurrió un error. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    if (!rsvp) {
      await searchGuest();
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/invitacion/${slug}/rsvp/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            weddingId: rsvp.weddingId,
            guestId: rsvp.guestId,
            status,
            answers: [],
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ?? "No pudimos guardar tu respuesta.",
        );
        return;
      }

      setMessage("¡Gracias por confirmar!");
    } catch {
      setMessage("Ocurrió un error. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
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
     <img src={DESIGN_01_ASSETS.desktop.teVemos} alt="¿Te vemos?" className="w-full max-w-md hidden md:block" />
     <img src={DESIGN_01_ASSETS.mobile.teVemos} alt="¿Te vemos?" className="w-full max-w-3xs md:hidden" />

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
          mt-4
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
          placeholder="Telefono"
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
        disabled={loading}
        className="
          mt-3
          rounded-full
          bg-(--design-01-dark)
          px-8
          py-2
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

      {/* Aclaración */}
      <p
        className="
          mt-3
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
      </p>

      {message && (
        <p className="mt-2 font-altivo text-[0.6rem] md:text-xs">
          {message}
        </p>
      )}
    </div>
  );
}