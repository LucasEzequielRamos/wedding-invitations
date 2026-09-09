import { z } from "zod";

export const rsvpAnswerSchema = z.object({
  questionId: z.string().uuid(),
  answer: z.unknown(),
});

export type RsvpAnswerInput = z.infer<typeof rsvpAnswerSchema>;