import { PublicRsvpForm } from "@/features/rsvp/components/public-rsvp-form";

type InvitationRsvpProps = {
  slug: string;
};

export function InvitationRsvp({ slug }: InvitationRsvpProps) {
  return (
    <div className="flex w-full items-center justify-center ">
      <PublicRsvpForm slug={slug} />
    </div>
  );
}