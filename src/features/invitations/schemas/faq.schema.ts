import { z } from "zod";

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const faqConfigSchema = z.object({
  variant: z.string().default("accordion"),
  title: z.string().optional(),
  items: z.array(faqItemSchema).default([]),
});

export type FaqItem = z.infer<typeof faqItemSchema>;
export type FaqConfig = z.infer<typeof faqConfigSchema>;