/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvitationHero } from "./invitation-hero";
import { InvitationEvents } from "./invitation-events";
import { InvitationGallery } from "./invitation-gallery";
import { InvitationGifts } from "./invitation-gifts";
import { InvitationRsvp } from "./invitation-rsvp";
import { InvitationIllustration } from "./invitation-illustration";
import { InvitationCustom } from "./invitation-custom";
import { illustrationConfigSchema } from "../schemas/illustration-config.schema";
import { customConfigSchema } from "../schemas/custom-config.schema";

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
  const config =
    section.config && typeof section.config === "object"
      ? (section.config as Record<string, unknown>)
      : {};

  const mediaId = typeof config.mediaId === "string" ? config.mediaId : null;

  const media = mediaId
    ? (invitation.media.find(item => item.id === mediaId) ?? null)
    : null;

  console.log("ILLUSTRATION DEBUG:", {
    config: section.config,
    mediaId,
    mediaIds: invitation.media.map(item => item.id),
  });

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

    case "ILLUSTRATION": {
      const config = illustrationConfigSchema.parse(section.config);

      const media =
        invitation.media.find(item => item.id === config.mediaId) ?? null;

      return <InvitationIllustration config={config} media={media} />;
    }
    case "CUSTOM": {
      const config = customConfigSchema.parse(section.config);

      return <InvitationCustom config={config} media={invitation.media} />;
    }
    default:
      return null;
  }
}
