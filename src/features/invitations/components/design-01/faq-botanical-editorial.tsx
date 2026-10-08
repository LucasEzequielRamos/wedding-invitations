import type { FaqConfig } from "../../schemas/faq.schema";

type Props = {
  config: FaqConfig;
};

export function FaqBotanicalEditorial({ config }: Props) {
  return (
    <section className="w-full bg-(--design-01-background) text-(--design-01-dark)">
      <div className="mx-auto w-full max-w-3xl px-8 py-12 md:px-16 md:py-20 md:max-w-4xl">
        {config.title && (
          <h2 className="mb-8 text-center font-script text-2xl font-normal md:mb-12 md:text-6xl">
            {config.title}
          </h2>
        )}

        <div className="flex flex-col gap-4 md:gap-6">
          {config.items.map((item, index) => (
            <details
              key={`${item.question}-${index}`}
              className="group border-b border-(--design-01-primary)/30 pb-4 md:pb-6"
            >
              <summary className="cursor-pointer list-none font-script text-base md:text-3xl">
                <div className="flex items-center justify-between gap-4">
                  <span>{item.question}</span>

                  <span className="font-altivo text-sm transition-transform duration-200 group-open:rotate-45 md:text-lg">
                  ^
                  </span>
                </div>
              </summary>

              <p className="mt-3 pr-6 font-altivo text-[0.7rem] leading-relaxed md:mt-4 md:text-xl">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}