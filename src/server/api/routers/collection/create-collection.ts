import { protectedProcedure } from "@/server/api/trpc";
import { collectionSchema } from "./collection-validators";

export const create = protectedProcedure
  .input(collectionSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.collection.create({
      data: {
        name: input.name,
        createdBy: { connect: { id: ctx.session.user.id } },
      },
    });
  });
