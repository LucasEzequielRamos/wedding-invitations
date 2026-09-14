import type { FaqConfig } from "../schemas/faq.schema";

type Props = {
  config: unknown;
};

export function InvitationFaq({ config }: Props) {
  const parsed = parseFaqConfig(config);

  if (!parsed || parsed.items.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        {parsed.title && (
          <h2 className="mb-8 text-center text-3xl font-semibold">
            {parsed.title}
          </h2>
        )}

        <div className="space-y-4">
          {parsed.items.map((item, index) => (
            <details key={`${item.question}-${index}`} className="border-b">
              <summary className="cursor-pointer py-4 font-medium">
                {item.question}
              </summary>

              <div className="pb-4 pt-1">
                <p className="text-sm leading-6">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function parseFaqConfig(config: unknown): FaqConfig | null {
  if (!config || typeof config !== "object") {
    return null;
  }

  const data = config as Record<string, unknown>;

  if (!Array.isArray(data.items)) {
    return null;
  }

  return {
    variant: typeof data.variant === "string" ? data.variant : "accordion",

    title: typeof data.title === "string" ? data.title : undefined,

    items: data.items.filter(
      (
        item,
      ): item is {
        question: string;
        answer: string;
      } => {
        if (!item || typeof item !== "object") {
          return false;
        }

        const value = item as Record<string, unknown>;

        return (
          typeof value.question === "string" && typeof value.answer === "string"
        );
      },
    ),
  };
}
