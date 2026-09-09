/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvitationHero } from "./invitation-hero";
import { InvitationEvents } from "./invitation-events";
import { InvitationGallery } from "./invitation-gallery";
import { InvitationGifts } from "./invitation-gifts";
import { InvitationRsvp } from "./invitation-rsvp";

type InvitationSection = {
  id: string;
  type: string;
  sortOrder: number;
  config: unknown;
};

type InvitationSectionRendererProps = {
  section: InvitationSection;
  invitation: {
    slug: string;
    name: string;
    weddingDate: Date | null;
    events: any[];
    media: any[];
    gifts: any[];
    giftsAvailable: boolean;
    rsvpAvailable: boolean;
  };
};

export function InvitationSectionRenderer({
  section,
  invitation,
}: InvitationSectionRendererProps) {
  switch (section.type) {
    case "HERO":
      return (
        <InvitationHero
          name={invitation.name}
          weddingDate={invitation.weddingDate}
        />
      );

    case "EVENTS":
      return invitation.events.length > 0 ? (
        <InvitationEvents events={invitation.events} />
      ) : null;

    case "GALLERY":
      return invitation.media.length > 0 ? (
        <InvitationGallery media={invitation.media} />
      ) : null;

    case "GIFTS":
      return invitation.giftsAvailable && invitation.gifts.length > 0 ? (
        <InvitationGifts gifts={invitation.gifts} />
      ) : null;

    case "RSVP":
      return invitation.rsvpAvailable ? (
        <InvitationRsvp slug={invitation.slug} />
      ) : null;

    default:
      return null;
  }
}
