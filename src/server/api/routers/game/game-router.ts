import { createTRPCRouter } from "@/server/api/trpc";
import { create } from "./create-game";

export const gameRouter = createTRPCRouter({ create });
