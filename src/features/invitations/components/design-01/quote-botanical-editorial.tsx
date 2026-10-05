import type { QuoteConfig } from "../../schemas/quote.schema";

type Props = {
  config: QuoteConfig;
};

export function QuoteBotanicalEditorial({ config }: Props) {
  return (
    <section className="bg-[#FDF6DC] px-6 py-12 text-[#283517]">
      <div className="mx-auto max-w-[800px] text-center">
        <blockquote className="font-script text-3xl leading-relaxed">
          “{config.text}”
        </blockquote>

        {config.author && <p className="mt-4 text-sm">— {config.author}</p>}
      </div>
    </section>
  );
}
