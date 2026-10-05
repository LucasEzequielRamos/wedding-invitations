import type { QuoteConfig } from "../schemas/quote.schema";

type Props = {
  config: QuoteConfig;
};

export function InvitationQuote({ config }: Props) {
  return (
    <section className="w-full px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <blockquote className="text-2xl italic">“{config.text}”</blockquote>

        {config.author && (
          <p className="mt-4 text-sm text-gray-500">— {config.author}</p>
        )}
      </div>
    </section>
  );
}
