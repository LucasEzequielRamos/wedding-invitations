import { z } from "zod";

export const textConfigSchema = z.object({
  text: z.string(),
  align: z
    .enum(["left", "center", "right"])
    .default("center"),
  variant: z.string().optional(),
});

export type TextConfig = z.infer<
  typeof textConfigSchema
>;