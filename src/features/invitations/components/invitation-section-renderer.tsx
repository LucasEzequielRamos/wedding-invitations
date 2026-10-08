import { InvitationHero } from "./invitation-hero";
import { InvitationEvent, InvitationEvents } from "./invitation-events";
import { InvitationGallery } from "./invitation-gallery";
import { InvitationGifts } from "./invitation-gifts";
import { InvitationRsvp } from "./invitation-rsvp";
import { InvitationIllustration } from "./invitation-illustration";
import { InvitationCustom } from "./invitation-custom";
import { InvitationFaq } from "./invitation-faq";
import { illustrationConfigSchema } from "../schemas/illustration-config.schema";
import { customConfigSchema } from "../schemas/custom-config.schema";
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
import { footerConfigSchema } from "../schemas/footer.schema";
import { FooterBotanicalEditorial } from "./design-01/footer-botanical-editorial";
import { IllustrationBotanicalEditorial } from "./design-01/illustration-botanical-editorial";
import { textConfigSchema } from "../schemas/text-config.schema";
import { InvitationText } from "./invitation-text";
import { TextBotanicalEditorial } from "./design-01/text-botanical-editorial";
import { quoteConfigSchema } from "../schemas/quote.schema";
import { InvitationQuote } from "./invitation-quote";
import { QuoteBotanicalEditorial } from "./design-01/quote-botanical-editorial";
import { StoryBotanicalEditorial } from "./design-01/story-botanical-editorial";
import { MicrosBotanicalEditorial } from "./design-01/micros-botanical-editorial";
import { PreweddingPhotoBotanicalEditorial } from "./design-01/prewedding-photo-botanical-editorial";

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
    weddingDate: Date | string;
    events: InvitationEvent[];
    media: InvitationMedia[];
    gifts: InvitationGift[];
    giftsAvailable: boolean;
    rsvpAvailable: boolean;
    id: string;
  };
};

type InvitationMedia = {
  id: string;
  path: string;
  type: string;
  alt: string | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
};

type InvitationGift = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  externalUrl: string | null;
  paymentUrl: string | null;
};

export function InvitationSectionRenderer({
  section,
  invitation,
}: InvitationSectionRendererProps) {
  const config =
    section.config && typeof section.config === "object"
      ? (section.config as Record<string, unknown>)
      : {};

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

       if (config.variant === "botanical-prewedding") {
    return <PreweddingPhotoBotanicalEditorial />;
  }

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
        return <RsvpBotanicalEditorial slug={invitation.slug} />;
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

      if (config.variant === "botanical") {
        return <IllustrationBotanicalEditorial config={config} media={media} />;
      }

      if (config.variant === "botanical-story") {
        return <StoryBotanicalEditorial />;
      }

      return <InvitationIllustration config={config} media={media} />;
    }

    case "MICROS": {
      if (config.variant === "botanical-editorial") {
        return <MicrosBotanicalEditorial />;
      }

      return null;
    }

    case "TEXT": {
      const config = textConfigSchema.parse(section.config);

      if (config.variant === "botanical-editorial") {
        return <TextBotanicalEditorial config={config} />;
      }

      return <InvitationText config={config} />;
    }

    case "QUOTE": {
      const config = quoteConfigSchema.parse(section.config);

      if (config.variant === "botanical-editorial") {
        return <QuoteBotanicalEditorial config={config} />;
      }

      return <InvitationQuote config={config} />;
    }

    case "CUSTOM": {
      const config = customConfigSchema.parse(section.config);

      return <InvitationCustom config={config} media={invitation.media} />;
    }

    case "COUNTDOWN": {
      const config = countdownConfigSchema.parse(section.config ?? {});

      if (config.variant === "botanical-editorial") {
        return (
          <CountdownBotanicalEditorial
            config={config}
            weddingDate={invitation.weddingDate}
          />
        );
      }
      return <InvitationCountdown targetDate={invitation.weddingDate} />;
    }

    case "FOOTER": {
      const config = footerConfigSchema.parse(section.config ?? {});

      // const media = config.mediaId
      //   ? (invitation.media.find(item => item.id === config.mediaId) ?? null)
      //   : null;

      if (config.variant === "botanical-editorial") {
        return <FooterBotanicalEditorial config={config}  />;
      }

      return null;
    }

    default:
      return null;
  }
}
