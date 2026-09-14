import { z } from "zod";

export const illustrationConfigSchema = z.object({
  variant: z.string().default("default"),
  mediaId: z.string().uuid().optional(),
  alt: z.string().optional(),
});

export type IllustrationConfig = z.infer<
  typeof illustrationConfigSchema
>;