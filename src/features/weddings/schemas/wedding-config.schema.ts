import { z } from "zod";

export const weddingConfigSchema = z.object({
  rsvpEnabled: z.boolean(),
  rsvpDeadline: z.coerce.date().nullable(),
  giftsEnabled: z.boolean(),
});

export type WeddingConfigInput = z.infer<typeof weddingConfigSchema>;