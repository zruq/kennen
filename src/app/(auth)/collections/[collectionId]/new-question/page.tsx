import NewQuestion from "./_components/new-question";
import { api } from "@/trpc/server";

const NewQuestionPage = async ({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) => {
  const id = Number((await params).collectionId);
  const collection = await api.collection.byId({
    id,
  });
  return <NewQuestion collectionId={collection.id} />;
};

export default NewQuestionPage;
