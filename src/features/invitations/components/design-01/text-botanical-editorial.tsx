import type { TextConfig } from "../../schemas/text-config.schema";

type Props = {
  config: TextConfig;
};

const ALIGN_CLASSES = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export function TextBotanicalEditorial({ config }: Props) {
  return (
    <section className="bg-[#FDF6DC] px-6 py-12 text-[#283517]">
      <div className={`mx-auto max-w-[800px] ${ALIGN_CLASSES[config.align]}`}>
        <p className="text-lg leading-relaxed">{config.text}</p>
      </div>
    </section>
  );
}
