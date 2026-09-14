import { z } from "zod";

const timelineItemSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.string().optional(),
  mediaId: z.string().uuid().optional(),
});

export const timelineConfigSchema = z.object({
  variant: z.string().default("default"),
  title: z.string().optional(),
  items: z.array(timelineItemSchema).default([]),
});

export type TimelineConfig = z.infer<
  typeof timelineConfigSchema
>;