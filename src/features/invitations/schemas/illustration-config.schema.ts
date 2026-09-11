import { z } from "zod";

export const illustrationConfigSchema = z.object({
  variant: z.string().min(1),
  mediaId: z.string().uuid().or(z.literal("")),
  alt: z.string().optional(),
});

export type IllustrationConfig = z.infer<
  typeof illustrationConfigSchema
>;

