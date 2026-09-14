import { z } from "zod";

export const heroConfigSchema = z.object({
  variant: z.string().default("default"),

  title: z.string().optional(),

  subtitle: z.string().optional(),

  date: z.string().optional(),

  mediaId: z.string().uuid().optional(),

  showDate: z.boolean().default(true),
});

export type HeroConfig = z.infer<
  typeof heroConfigSchema
>;