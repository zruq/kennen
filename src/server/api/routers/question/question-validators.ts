import { z } from "zod";

export const questionSchema = z.object({
  collectionId: z.number(),
  choices_limit: z.number().int().positive(),
  text: z.string().trim().min(2),
  options: z.array(
    z.object({
      text: z.string().trim().min(2),
      isCorrect: z.boolean().default(false),
    }),
  ),
});

export type QuestionFormData = z.infer<typeof questionSchema>;
