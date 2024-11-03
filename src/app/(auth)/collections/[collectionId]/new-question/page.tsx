import { type NextPage } from "next";
import NewQuestion from "./_components/new-question";
import { api } from "@/trpc/server";

const NewQuestionPage: NextPage<{ params: { collectionId: string } }> = async (
  props,
) => {
  const collection = await api.collection.byId({
    id: Number(props.params.collectionId),
  });
  return <NewQuestion collectionId={collection.id} />;
};

export default NewQuestionPage;
