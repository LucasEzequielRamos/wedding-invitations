import { z } from "zod";

export const quoteConfigSchema = z.object({
  text: z.string(),
  author: z.string().optional(),
  variant: z.string().optional(),
});

export type QuoteConfig = z.infer<
  typeof quoteConfigSchema
>;