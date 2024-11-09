import { z } from "zod";

export const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("toggle-ready") }),
]);

export const userSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(3).nullish(),
  image: z.string().trim().url().nullish(),
});

export const currentQuestionSchema = z
  .object({
    index: z.number().int().gte(0),
    timeLeft: z.number().int().gte(0),
  })
  .nullable();

export const messageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("user-joined"), user: userSchema }),
  z.object({ type: z.literal("user-left"), userId: z.string() }),
  z.object({
    type: z.literal("ready-status-changed"),
    userId: z.string(),
    isReady: z.boolean(),
  }),
  z.object({
    type: z.literal("on-connect-data"),
    users: z.array(
      userSchema.extend({ isReady: z.boolean(), score: z.number() }),
    ),
    adminId: z.string(),
    currentQuestion: currentQuestionSchema,
  }),
]);

export type MessageData = z.infer<typeof messageSchema>;

export type User = z.infer<typeof userSchema>;

export type CurrentQuestion = z.infer<typeof currentQuestionSchema>;
