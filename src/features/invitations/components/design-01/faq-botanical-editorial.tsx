import { InvitationFaq } from "../invitation-faq";
import type { FaqConfig } from "../../schemas/faq.schema";

type Props = {
  config: FaqConfig;
};

export function FaqBotanicalEditorial({ config }: Props) {
  return (
    <section className="bg-[#FDF6DC] px-6 py-16 text-[#283517]">
      <div className="mx-auto max-w-[800px]">
        <InvitationFaq config={config} />
      </div>
    </section>
  );
}
