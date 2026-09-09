import { z } from "zod";

export const invitationSectionTypeSchema = z.enum([
  "HERO",
  "COUNTDOWN",
  "EVENTS",
  "GALLERY",
  "RSVP",
  "GIFTS",
  "QUOTE",
  "TEXT",
  "ILLUSTRATION",
  "TIMELINE",
  "FOOTER",
  "CUSTOM",
]);

export const invitationSectionSchema = z.object({
  type: invitationSectionTypeSchema,
  enabled: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  config: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type InvitationSectionInput = z.infer<
  typeof invitationSectionSchema
>;