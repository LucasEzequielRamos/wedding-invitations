import { z } from "zod";

export const importGuestRowSchema = z.object({
  Grupo: z.string().trim().optional().default(""),
  Nombre: z.string().trim().min(1),
  Apellido: z.string().trim().min(1),
});

export type ImportGuestRow = z.infer<
  typeof importGuestRowSchema
>;