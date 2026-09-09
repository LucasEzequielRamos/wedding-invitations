import { z } from "zod";

export const mediaTypeSchema = z.enum([
  "hero",
  "gallery",
  "illustration",
  "other",
]);

export const mediaSchema = z.object({
  type: mediaTypeSchema,
  alt: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal("")),
  sortOrder: z.number().int().default(0),
});

export type MediaInput = z.infer<typeof mediaSchema>;