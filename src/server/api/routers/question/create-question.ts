import { protectedProcedure } from "@/server/api/trpc";
import { questionSchema } from "./question-validators";

export const create = protectedProcedure
  .input(questionSchema)
  .mutation(
    async ({ ctx, input: { text, collectionId, choices_limit, options } }) => {
      return ctx.db.question.create({
        data: {
          text,
          type: "multiple_choice",
          multipleChoice: {
            create: {
              createdBy: { connect: { id: ctx.session.user.id } },
              choices_limit,
              options: {
                createMany: {
                  data: options.map((option) => ({
                    ...option,
                    userId: ctx.session.user.id,
                  })),
                },
              },
            },
          },
          createdBy: { connect: { id: ctx.session.user.id } },
          collection: { connect: { id: collectionId } },
        },
      });
    },
  );
