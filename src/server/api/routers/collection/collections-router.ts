import { createTRPCRouter } from "@/server/api/trpc";
import { create } from "./create-collection";
import { editCollectionById } from "./edit-collection-by-id";
import { getUserCollections } from "./get-user-collections";
import { getCollectionById } from "./get-collection-by-id";
import { deleteCollectionById } from "./delete-collection-by-id";

export const collectionRouter = createTRPCRouter({
  create,
  editById: editCollectionById,
  deleteById: deleteCollectionById,
  mine: getUserCollections,
  byId: getCollectionById,
});
