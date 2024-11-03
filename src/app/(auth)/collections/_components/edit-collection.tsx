import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { type SubmitHandler } from "react-hook-form";
import { api } from "@/trpc/react";
import { type Dispatch, type SetStateAction } from "react";
import CollectionForm from "./collection-form";
import { type CollectionFormData } from "@/server/api/routers/collection/collection-validators";
import QueryResult from "@/components/ui/query-result";

type EditCollectionProps = {
  collectionId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function EditCollection({
  collectionId,
  open,
  setOpen,
}: EditCollectionProps) {
  const utils = api.useUtils();
  const collectionQueryResult = api.collection.byId.useQuery(
    { id: collectionId },
    {
      initialData: () => {
        return utils.collection.mine
          .getData()
          ?.find((collection) => collection.id === collectionId);
      },
    },
  );
  const { mutateAsync } = api.collection.editById.useMutation();
  const onSubmit: SubmitHandler<CollectionFormData> = async ({ name }) => {
    await mutateAsync({ name, id: collectionId });
    await utils.collection.mine.invalidate();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon /> Edit Collection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
          <QueryResult result={collectionQueryResult}>
            {(data) => (
              <CollectionForm
                onCancel={() => setOpen(false)}
                onSubmit={onSubmit}
                defaultValues={data}
              />
            )}
          </QueryResult>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
