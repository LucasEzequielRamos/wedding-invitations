import { InvitationRsvp } from "../invitation-rsvp";
import { DESIGN_01_ASSETS } from "../../utils/design-assets";

type Props = {
  slug: string;
};

export function RsvpBotanicalEditorial({ slug }: Props) {
  return (
    <section className="relative md:mt-30  h-120 w-full overflow-hidden bg-(--design-01-background) md:h-240">
      {/* Fondo desktop */}
      <div
        className="absolute inset-0 hidden bg-contain bg-top bg-no-repeat md:block"
        style={{
          backgroundImage: `url(${DESIGN_01_ASSETS.desktop.fondoAsistencia})`,
        }}
      />

      {/* Fondo mobile */}
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat md:hidden "
        style={{
          backgroundImage: `url(${DESIGN_01_ASSETS.desktop.fondoAsistencia})`,
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <InvitationRsvp slug={slug} />
      </div>
    </section>
  );
}