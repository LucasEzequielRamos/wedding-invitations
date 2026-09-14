/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvitationHero } from "./invitation-hero";
import { InvitationEvents } from "./invitation-events";
import { InvitationGallery } from "./invitation-gallery";
import { InvitationGifts } from "./invitation-gifts";
import { InvitationRsvp } from "./invitation-rsvp";
import { InvitationIllustration } from "./invitation-illustration";
import { InvitationCustom } from "./invitation-custom";
import { InvitationFaq } from "./invitation-faq";
import { illustrationConfigSchema } from "../schemas/illustration-config.schema";
import { customConfigSchema } from "../schemas/custom-config.schema";
import { parseSectionConfig } from "../schemas/parse-section-config";
import { heroConfigSchema } from "../schemas/hero.schema";
import { HeroBotanicalEditorial } from "./design-01/hero-botanical-editorial";
import { CountdownBotanicalEditorial } from "./design-01/countdown-botanical-editorial";
import { InvitationCountdown } from "./invitation-countdown";
import { countdownConfigSchema } from "../schemas/countdown.schema";
import { EventsBotanicalEditorial } from "./design-01/events-botanical-editorial";
import { RsvpBotanicalEditorial } from "./design-01/rsvp-botanical-editorial";
import { GalleryBotanicalEditorial } from "./design-01/gallery-botanical-editorial";
import { faqConfigSchema } from "../schemas/faq.schema";
import { FaqBotanicalEditorial } from "./design-01/faq-botanical-editorial";
import { GiftsBotanicalEditorial } from "./design-01/gifts-botanical-editorial";

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
    id: string;
  };
};

export function InvitationSectionRenderer({
  section,
  invitation,
}: InvitationSectionRendererProps) {
  // console.log(invitation);
  const config =
    section.config && typeof section.config === "object"
      ? (section.config as Record<string, unknown>)
      : {};

  const mediaId = typeof config.mediaId === "string" ? config.mediaId : null;

  const sectionMedia = mediaId
    ? (invitation.media.find(item => item.id === mediaId) ?? null)
    : null;

  // console.log("ILLUSTRATION DEBUG:", {
  //   config: section.config,
  //   mediaId,
  //   mediaIds: invitation.media.map(item => item.id),
  // });

  switch (section.type) {
    case "HERO": {
      const config = heroConfigSchema.parse(section.config ?? {});

      const media = config.mediaId
        ? (invitation.media.find(item => item.id === config.mediaId) ?? null)
        : null;

      if (config.variant === "botanical-editorial") {
        return <HeroBotanicalEditorial config={config} media={media} />;
      }

      return <InvitationHero config={config} media={media} />;
    }
    case "EVENTS":
      if (config.variant === "botanical-editorial") {
        return <EventsBotanicalEditorial events={invitation.events} />;
      }

      return <InvitationEvents events={invitation.events} />;

    case "GALLERY": {
      if (config.variant === "botanical-editorial") {
        return (
          <GalleryBotanicalEditorial
            media={invitation.media.filter(item => item.type === "GALLERY")}
          />
        );
      }

      return (
        <InvitationGallery
          media={invitation.media.filter(item => item.type === "GALLERY")}
        />
      );
    }

    case "GIFTS": {
      if (config.variant === "botanical-editorial") {
        return <GiftsBotanicalEditorial gifts={invitation.gifts} />;
      }

      return <InvitationGifts gifts={invitation.gifts} />;
    }

    case "RSVP": {
      if (config.variant === "botanical-editorial") {
        return <RsvpBotanicalEditorial weddingId={invitation.id} />;
      }

      return <InvitationRsvp slug={invitation.slug} />;
    }

    case "FAQ": {
      const config = faqConfigSchema.parse(section.config ?? {});

      if (config.variant === "botanical-editorial") {
        return <FaqBotanicalEditorial config={config} />;
      }

      return <InvitationFaq config={config} />;
    }

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

    case "COUNTDOWN": {
      const config = countdownConfigSchema.parse(section.config ?? {});

      if (config.variant === "botanical-editorial") {
        return <CountdownBotanicalEditorial config={config} />;
      }

      return <InvitationCountdown targetDate={config.targetDate} />;
    }

    default:
      return null;
  }
}
