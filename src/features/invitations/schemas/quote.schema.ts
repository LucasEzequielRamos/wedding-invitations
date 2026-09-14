import { z } from "zod";

export const quoteConfigSchema = z.object({
  variant: z.string().default("default"),
  text: z.string(),
  author: z.string().optional(),
});

export type QuoteConfig = z.infer<
  typeof quoteConfigSchema
>;