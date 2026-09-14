import { z } from "zod";

import { illustrationConfigSchema } from "./illustration-config.schema";
import { customConfigSchema } from "./custom-config.schema";
import { quoteConfigSchema } from "./quote-config.schema";
import { textConfigSchema } from "./text-config.schema";
import { heroConfigSchema } from "./hero.schema";
import { countdownConfigSchema } from "./countdown.schema";
import { faqConfigSchema } from "./faq.schema";
import { timelineConfigSchema } from "./timeline.schema";

export const invitationSectionTypeSchema = z.enum([
  "HERO",
  "COUNTDOWN",
  "EVENTS",
  "GALLERY",
  "RSVP",
  "GIFTS",
  "QUOTE",
  "TEXT",
  "ILLUSTRATION",
  "TIMELINE",
  "FOOTER",
  "CUSTOM",
  "FAQ",
]);

export const invitationSectionSchema = z.object({
  type: invitationSectionTypeSchema,
  enabled: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  config: z.unknown().nullable().optional(),
});

export function validateSectionConfig(
  type: z.infer<typeof invitationSectionTypeSchema>,
  config: unknown,
) {
  switch (type) {
    case "ILLUSTRATION":
      return illustrationConfigSchema.parse(config);

    case "CUSTOM":
      return customConfigSchema.parse(config);

    case "QUOTE":
      return quoteConfigSchema.parse(config);

    case "TEXT":
      return textConfigSchema.parse(config);

    case "HERO":
      return heroConfigSchema.parse(config ?? {});
    case "COUNTDOWN":
      return countdownConfigSchema.parse(config ?? {});
    case "FAQ":
      return faqConfigSchema.parse(config ?? {});
    case "TIMELINE":
      return timelineConfigSchema.parse(config ?? {});
    case "EVENTS":
    case "GALLERY":
    case "RSVP":
    case "GIFTS":
    case "FOOTER":
      return config ?? {};

    default:
      return config ?? {};
  }
}