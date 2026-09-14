import { z } from "zod";

export const createGuestSchema = z.object({
  weddingId: z.string().uuid(),

  groupId: z.string().uuid().nullable().optional(),

  firstName: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(100),

  lastName: z
    .string()
    .trim()
    .min(1, "El apellido es obligatorio")
    .max(100),
});

export const updateGuestSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1)
    .max(100),

  lastName: z
    .string()
    .trim()
    .min(1)
    .max(100),

  groupId: z.string().uuid().nullable().optional(),
});

export const createGuestGroupSchema = z.object({
  weddingId: z.string().uuid(),

  name: z
    .string()
    .trim()
    .min(1, "El nombre del grupo es obligatorio")
    .max(100),
});

export type CreateGuestInput = z.infer<
  typeof createGuestSchema
>;

export type UpdateGuestInput = z.infer<
  typeof updateGuestSchema
>;

export type CreateGuestGroupInput = z.infer<
  typeof createGuestGroupSchema
>;