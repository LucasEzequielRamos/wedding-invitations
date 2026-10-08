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
    <section className="w-full bg-(--design-01-background) px-0 py-5 md:py-8">
      <div className="w-full bg-(--design-01-primary) text-(--design-01-white)">
        <div className="mx-auto flex  w-full max-w-300 flex-col items-center justify-center px-6 py-7 md:min-h-40 md:px-10 md:py-10">
          {config.title && (
            <h2 className="mb-7 text-center font-script text-3xl font-normal leading-none md:mb-9 md:text-4xl">
              {config.title}
            </h2>
          )}

          <InvitationCountdown targetDate={weddingDate} />
        </div>
      </div>
    </section>
  );
}
