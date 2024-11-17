import type { Quiz } from "@/server/api/routers/game/create-game";
import { z } from "zod";

export const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("toggle-ready") }),
  z.object({ action: z.literal("start-game") }),
  z.object({
    action: z.literal("answer-question"),
    questionId: z.number(),
    optionId: z.number(),
  }),
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

type Question = Quiz[number];

export type QuestionWithoutCorrectOptions = Omit<Question, "options"> & {
  options: Omit<Question["options"][number], "isCorrect">[];
};

export type MessageData =
  | {
      type: "scores-updated";
      scores: Array<{ userId: string; score: number }>;
    }
  | {
      type: "game-started";
    }
  | {
      type: "user-joined";
      user: User;
    }
  | {
      type: "user-left";
      userId: string;
    }
  | {
      type: "ready-status-changed";
      userId: string;
      isReady: boolean;
    }
  | {
      type: "on-connect-data";
      users: Array<User & { isReady: boolean; score: number }>;
      adminId: string;
    }
  | {
      type: "new-question";
      question: QuestionWithoutCorrectOptions;
      timeleft: number;
    }
  | {
      type: "timeleft-changed";
      timeleft: number;
    }
  | {
      type: "question-answers";
      answers: Array<{ optionId: number; users: Array<string> }>;
      correctAnswer: Array<number>;
    };

export type QuestionAnswersMessageData = Extract<
  MessageData,
  { type: "question-answers" }
>;

export type ScoreUpdatedMessageData = Extract<
  MessageData,
  { type: "scores-updated" }
>;

export type GameStartedMessageData = Extract<
  MessageData,
  { type: "game-started" }
>;

export type ReadyStatusChangedMessageData = Extract<
  MessageData,
  { type: "ready-status-changed" }
>;

export type OnConnectMessageData = Extract<
  MessageData,
  { type: "on-connect-data" }
>;

export type UserLeftMessageData = Extract<MessageData, { type: "user-left" }>;

export type UserJoinedMessageData = Extract<
  MessageData,
  { type: "user-joined" }
>;

export type NewQuestionMessageData = Extract<
  MessageData,
  { type: "new-question" }
>;

export type TimeLeftChangedMessageData = Extract<
  MessageData,
  { type: "timeleft-changed" }
>;

export type User = z.infer<typeof userSchema>;

export type CurrentQuestion = z.infer<typeof currentQuestionSchema>;
