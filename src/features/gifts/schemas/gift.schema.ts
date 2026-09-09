import { z } from "zod";

export const giftSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio"),

  description: z
    .string()
    .trim()
    .optional(),

  image: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  externalUrl: z
    .string()
    .url("El enlace externo no es válido")
    .optional()
    .or(z.literal("")),

  paymentUrl: z
    .string()
    .url("El enlace de pago no es válido")
    .optional()
    .or(z.literal("")),

  sortOrder: z
    .number()
    .int()
    .default(0),

  isVisible: z
    .boolean()
    .default(true),
});

export type GiftInput = z.infer<
  typeof giftSchema
>;