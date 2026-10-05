import { InvitationCountdown } from "../invitation-countdown";

type Props = {
  config: {
    title?: string;
  };
  weddingDate: Date | string;
};

export function CountdownBotanicalEditorial({ config, weddingDate }: Props) {
  if (!weddingDate) {
    return null;
  }

  return (
    <section className="bg-[#566B30] px-6 py-10 text-white">
      <div className="mx-auto max-w-[1200px] text-center">
        {config.title && (
          <h2 className="mb-6 text-2xl font-medium">{config.title}</h2>
        )}

        <InvitationCountdown targetDate={weddingDate} />
      </div>
    </section>
  );
}
