import { z } from "zod";

export const collectionSchema = z.object({
  name: z.string().trim().toLowerCase().min(2).max(50),
});

export type CollectionFormData = z.infer<typeof collectionSchema>;
