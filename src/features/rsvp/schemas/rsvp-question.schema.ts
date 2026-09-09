import { z } from "zod";

export const rsvpQuestionTypeSchema = z.enum([
  "TEXT",
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "BOOLEAN",
]);

export const rsvpQuestionSchema = z
  .object({
    question: z.string().trim().min(1, "La pregunta es obligatoria"),

    type: rsvpQuestionTypeSchema,

    required: z.boolean().default(false),

    options: z.array(z.string().trim().min(1)).optional(),

    sortOrder: z.number().int().default(0),
  })
  .superRefine((data, ctx) => {
    const needsOptions =
      data.type === "SINGLE_CHOICE" ||
      data.type === "MULTIPLE_CHOICE";

    if (needsOptions && (!data.options || data.options.length === 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "Este tipo de pregunta requiere opciones",
      });
    }

    if (!needsOptions && data.options && data.options.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "Este tipo de pregunta no utiliza opciones",
      });
    }
  });

export type RsvpQuestionInput = z.infer<typeof rsvpQuestionSchema>;