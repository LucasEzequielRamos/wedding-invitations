import { z } from "zod";

export const createWeddingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(100),

  slug: z
    .string()
    .trim()
    .min(1, "El slug es obligatorio")
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "El slug solo puede contener letras minúsculas, números y guiones",
    ),

  weddingDate: z.coerce.date(),

  plan: z.enum(["INFORMATIVE", "FULL"]),
});

export const updateWeddingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(100),

  slug: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug inválido",
    ),

  weddingDate: z.coerce.date(),

  plan: z.enum(["INFORMATIVE", "FULL"]),
});

export type CreateWeddingInput = z.infer<
  typeof createWeddingSchema
>;

export type UpdateWeddingInput = z.infer<
  typeof updateWeddingSchema
>;