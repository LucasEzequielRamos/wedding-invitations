import { z } from "zod";
import { rsvpAnswerSchema } from "./rsvp-answer.schema";

export const submitRsvpSchema = z.object({
  weddingId: z.string().uuid(),

  guestId: z.string().uuid(),

  status: z.enum(["ATTENDING", "NOT_ATTENDING"]),

  answers: z.array(rsvpAnswerSchema).default([]),
});

export type SubmitRsvpInput = z.infer<typeof submitRsvpSchema>;