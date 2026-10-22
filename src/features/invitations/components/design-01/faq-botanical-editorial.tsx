
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
          {config.items.map((item, index) => {
            const parts = item.answer.split(/(\(enviar wpp\))/gi);

            return (
              <details
                key={`${item.question}-${index}`}
                className="group border-b border-(--design-01-primary)/30 pb-4 md:pb-6"
              >
                <summary className="cursor-pointer list-none font-script text-base md:text-3xl">
                  <div className="flex items-center justify-between gap-4">
                    <span>{item.question}</span>

                    <span className="flex h-4 w-4 items-center justify-center rounded-full transition-transform duration-200 group-open:rotate-180 md:h-6 md:w-6">
                      <svg
                        width="26"
                        height="17"
                        viewBox="0 0 26 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.5 1.5L13 14.5L24.5 1.5"
                          strokeWidth="3"
                          strokeLinecap="round"
                          stroke="#283517"
                        />
                      </svg>
                    </span>
                  </div>
                </summary>

                <p className="mt-3 pr-6 font-altivo text-[0.7rem] leading-relaxed md:mt-4 md:text-xl">
                  {parts.map((part, partIndex) =>
                    /^\(enviar wpp\)$/i.test(part) ? (
                      <a
                        key={partIndex}
                        href={`https://wa.me/${process.env.PLANNER_NUM}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 my-2 flex items-center justify-center w-fit mx-auto rounded-full border-2 border-(--design-01-primary) bg-(--design-01-primary) px-2 py-1 font-altivo text-xs uppercase tracking-[0.08em] text-(--design-01-white) md:text-2xl"
                      >
                        ENVIAR MENSAJE
                      </a>
                    ) : (
                      <span key={partIndex}>{part}</span>
                    )
                  )}
                </p>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
