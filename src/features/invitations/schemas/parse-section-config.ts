import { heroConfigSchema } from "./hero.schema";
import { countdownConfigSchema } from "./countdown.schema";
import { timelineConfigSchema } from "./timeline.schema";
import { faqConfigSchema } from "./faq.schema";
import { quoteConfigSchema } from "./quote.schema";
import { illustrationConfigSchema } from "./illustration.schema";

export function parseSectionConfig(
  type: string,
  config: unknown,
) {
  switch (type) {
    case "HERO":
      return heroConfigSchema.parse(config ?? {});

    case "COUNTDOWN":
      return countdownConfigSchema.parse(config ?? {});

    case "TIMELINE":
      return timelineConfigSchema.parse(config ?? {});

    case "FAQ":
      return faqConfigSchema.parse(config ?? {});

    case "QUOTE":
      return quoteConfigSchema.parse(config ?? {});

    case "ILLUSTRATION":
      return illustrationConfigSchema.parse(
        config ?? {},
      );

    default:
      return config;
  }
}