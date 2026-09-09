import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),

  date: z.coerce.date({
    error: "La fecha no es válida",
  }),

  time: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  location: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  mapsUrl: z
    .string()
    .url("El enlace de Google Maps no es válido")
    .optional()
    .or(z.literal("")),

  sortOrder: z.number().int().default(0),
});

export type EventInput = z.infer<typeof eventSchema>;