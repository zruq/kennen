import { createTRPCRouter } from "@/server/api/trpc";
import { create } from "./create-question";

export const questionRouter = createTRPCRouter({
  create,
});
