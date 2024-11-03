import { protectedProcedure } from "@/server/api/trpc";

export const getUserCollections = protectedProcedure.query(async ({ ctx }) => {
  return ctx.db.collection.findMany({
    orderBy: { createdAt: "desc" },
    where: { createdBy: { id: ctx.session.user.id } },
  });
});
