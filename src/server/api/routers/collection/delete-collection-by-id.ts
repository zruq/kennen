import { z } from "zod";
import { protectedProcedure } from "@/server/api/trpc";

export const deleteCollectionById = protectedProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.collection.delete({
      where: {
        id: input.id,
        userId: ctx.session.user.id,
      },
    });
  });
