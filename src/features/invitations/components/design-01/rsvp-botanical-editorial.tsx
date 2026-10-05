import { InvitationRsvp } from "../invitation-rsvp";

type Props = {
  slug: string;
};

export function RsvpBotanicalEditorial({ slug }: Props) {
  return (
    <section className="bg-[#FDF6DC] px-6 py-16 text-[#283517]">
      <div className="mx-auto max-w-[700px]">
        <div className="rounded-[2rem] border-2 border-[#566B30] p-6 sm:p-10">
          <InvitationRsvp slug={slug} />
        </div>
      </div>
    </section>
  );
}
