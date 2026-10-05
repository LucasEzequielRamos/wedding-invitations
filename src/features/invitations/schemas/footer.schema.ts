import { z } from "zod";

export const footerConfigSchema = z.object({
  variant: z.string().default("botanical-editorial"),
  title: z.string().default("Te esperamos!"),
  mediaId: z.string().optional(),
});

export type FooterConfig = z.infer<typeof footerConfigSchema>;