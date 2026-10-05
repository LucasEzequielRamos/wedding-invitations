import type { TextConfig } from "../schemas/text-config.schema";

type Props = {
  config: TextConfig;
};

const ALIGN_CLASSES = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export function InvitationText({ config }: Props) {
  return (
    <section className="w-full px-6 py-16">
      <div className={`mx-auto max-w-3xl ${ALIGN_CLASSES[config.align]}`}>
        <p>{config.text}</p>
      </div>
    </section>
  );
}
