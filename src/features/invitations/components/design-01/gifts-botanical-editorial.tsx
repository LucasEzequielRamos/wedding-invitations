import { InvitationGifts } from "../invitation-gifts";

type InvitationGift = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  externalUrl: string | null;
  paymentUrl: string | null;
};

type InvitationGiftsProps = {
  gifts: InvitationGift[];
};

export function GiftsBotanicalEditorial({ gifts }: InvitationGiftsProps) {
  return (
    <section className="bg-[#FDF6DC] px-6 py-16 text-[#283517]">
      <div className="mx-auto max-w-[800px] text-center">
        <InvitationGifts gifts={gifts} />
      </div>
    </section>
  );
}
