import { env } from "@/env";
import { publicProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";

async function getQuestions(db: PrismaClient) {
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
  });
  return questions.map(({ text, multipleChoice, id }) => ({
    id,
    text,
    options: multipleChoice?.options ?? [],
    choicesLimit: multipleChoice?.choices_limit ?? 1,
  }));
}

export type Quiz = Awaited<ReturnType<typeof getQuestions>>;

export const create = publicProcedure
  .input(z.object({ username: z.string() }))
  .mutation(async ({ ctx }) => {
    const gameId = crypto.randomUUID();
    const userId = ctx.session?.user?.id ?? crypto.randomUUID();
    const questions = await getQuestions(ctx.db);
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
