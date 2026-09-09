import Link from "next/link";

type InvitationRsvpProps = {
  slug: string;
};

export function InvitationRsvp({ slug }: InvitationRsvpProps) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h2 className="text-3xl font-bold">Confirmá tu asistencia</h2>

      <p className="mt-4 text-gray-500">
        Queremos saber si vas a acompañarnos en este día tan especial.
      </p>

      <Link
        href={`/invitacion/${slug}/rsvp`}
        className="mt-8 inline-block rounded-md bg-black px-6 py-3 font-medium text-white"
      >
        Confirmar asistencia
      </Link>
    </section>
  );
}
