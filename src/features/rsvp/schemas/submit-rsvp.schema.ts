import { z } from "zod";
import { rsvpAnswerSchema } from "./rsvp-answer.schema";

export const submitRsvpSchema = z.object({
  weddingId: z.string().uuid(),
  guestId: z.string().uuid(),
  status: z.enum(["ATTENDING", "NOT_ATTENDING"]),
  needsBus: z.boolean().default(false),
  busStopId: z.string().uuid().nullable().default(null),
  answers: z.array(rsvpAnswerSchema).default([]),
});

export type SubmitRsvpInput = z.infer<typeof submitRsvpSchema>;