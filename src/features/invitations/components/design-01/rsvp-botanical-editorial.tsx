import { InvitationRsvp } from "../invitation-rsvp";
import { DESIGN_01_ASSETS } from "../../utils/design-assets";

type Props = {
  slug: string;
};

export function RsvpBotanicalEditorial({ slug }: Props) {
  return (
    <section className="relative min-h-[500px] mt-8 h-auto w-full @container bg-(--design-01-background) md:mt-30 md:h-240">
      {/* Fondo desktop */}
      <div
        className="absolute inset-0 hidden bg-contain bg-top bg-no-repeat md:block"
        style={{
          backgroundImage: `url(${DESIGN_01_ASSETS.desktop.fondoAsistencia})`,
        }}
      />

      {/* Fondo mobile */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat @max-[321px]:bg-cover md:hidden"
        style={{
          backgroundImage: `url(${DESIGN_01_ASSETS.desktop.fondoAsistencia})`,
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 flex min-h-[500px] w-full items-center justify-center py-8 md:h-full md:py-0">
        <InvitationRsvp slug={slug} />
      </div>
    </section>
  );
}