import { z } from "zod";

export const countdownConfigSchema = z.object({
  variant: z.string().default("default"),
  title: z.string().optional(),
  targetDate: z.string(),
  showDays: z.boolean().default(true),
  showHours: z.boolean().default(true),
  showMinutes: z.boolean().default(true),
  showSeconds: z.boolean().default(true),
});

export type CountdownConfig = z.infer<
  typeof countdownConfigSchema
>;