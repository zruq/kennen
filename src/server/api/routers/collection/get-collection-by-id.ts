import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const getCollectionById = protectedProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ ctx, input }) => {
    return ctx.db.collection.findUniqueOrThrow({
      where: { id: input.id, userId: ctx.session.user.id },
    });
  });
