import { z } from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { collectionSchema } from "./collection-validators";

export const editCollectionById = protectedProcedure
  .input(collectionSchema.extend({ id: z.number() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.collection.update({
      data: {
        name: input.name,
      },
      where: {
        id: input.id,
        userId: ctx.session.user.id,
      },
    });
  });
