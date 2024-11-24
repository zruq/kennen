import { env } from "@/env";
import { publicProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { db } from "@/server/db";

async function getQuestionsIds(collections: Array<number>) {
  return db.question.findMany({
    select: { id: true },
    where: { collectionId: { in: collections } },
  });
}

async function getQuestions(
  db: PrismaClient,
  {
    collections,
    questionsCount,
  }: { collections: Array<number>; questionsCount: number },
) {
  const ids = getRandomSubarray(
    await getQuestionsIds(collections),
    questionsCount,
  ).map(({ id }) => id);
  const questions = await db.question.findMany({
    select: {
      id: true,
      text: true,
      multipleChoice: {
        select: {
          choices_limit: true,
          options: {
            select: {
              id: true,
              text: true,
              isCorrect: true,
            },
          },
        },
      },
    },
    where: {
      id: { in: ids },
    },
  });
  return ids.map((id) => {
    const { text, multipleChoice } = questions.find((q) => q.id === id)!;
    return {
      id,
      text,
      options: multipleChoice?.options ?? [],
      choicesLimit: multipleChoice?.choices_limit ?? 1,
    };
  });
}

export type Quiz = Awaited<ReturnType<typeof getQuestions>>;

export const create = publicProcedure
  .input(z.object({ username: z.string() }))
  .mutation(async ({ ctx }) => {
    const gameId = crypto.randomUUID();
    const userId = ctx.session?.user?.id ?? crypto.randomUUID();
    const questions = await getQuestions(ctx.db, {
      questionsCount: 4,
      collections: [4, 5, 6, 7],
    });
    await fetch(env.NEXT_PUBLIC_PARTYKIT_URL + `/party/${gameId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.PARTYKIT_SECRET}`,
      },
      body: JSON.stringify({ questions, adminId: userId }),
    });
    return { gameId, userId };
  });

function getRandomSubarray<T>(arr: T[], length: number): T[] {
  if (length > arr.length) {
    length = arr.length;
  }
  const shuffled = [...arr];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }

  return shuffled.slice(0, length);
}
