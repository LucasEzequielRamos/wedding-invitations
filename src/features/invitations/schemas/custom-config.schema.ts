import { z } from "zod";

export const customConfigSchema = z.object({
  variant: z.string().min(1),
  media: z.record(
    z.string(),
    z.string().uuid().or(z.literal("")),
  ),
});

export type CustomConfig = z.infer<
  typeof customConfigSchema
>;