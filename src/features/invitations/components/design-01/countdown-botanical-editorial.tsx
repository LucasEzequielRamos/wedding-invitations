"use client";

import type { CountdownConfig } from "../../schemas/countdown.schema";
import { InvitationCountdown } from "../invitation-countdown";

type Props = {
  config: CountdownConfig;
};

export function CountdownBotanicalEditorial({ config }: Props) {
  return (
    <section className="bg-[#566B30] px-6 py-10 text-white">
      <div className="mx-auto max-w-[1200px] text-center">
        {config.title && (
          <h2 className="mb-6 text-2xl font-medium">{config.title}</h2>
        )}

        <InvitationCountdown targetDate={config.targetDate} />
      </div>
    </section>
  );
}
