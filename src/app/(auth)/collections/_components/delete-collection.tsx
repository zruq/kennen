import { api } from "@/trpc/react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Dispatch, SetStateAction } from "react";
import QueryResult from "@/components/ui/query-result";
import { useForm } from "react-hook-form";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

type DeleteCollectionProps = {
  collectionId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function DeleteCollection({
  collectionId,
  open,
  setOpen,
}: DeleteCollectionProps) {
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
  const form = useForm();
  const { mutateAsync } = api.collection.deleteById.useMutation();
  const onSubmit = async () => {
    await mutateAsync({ id: collectionId });
    await utils.collection.mine.invalidate();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <QueryResult result={collectionQueryResult}>
          {({ name }) => (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Do you want to delete the collection{" "}
                  <span className="italic">&quot;{name}&quot;</span>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  collection and all the questions related to it.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                <Button
                  disabled={form.formState.isSubmitting}
                  variant="destructive"
                  type="submit"
                >
                  {form.formState.isSubmitting && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete
                </Button>
              </AlertDialogFooter>
            </form>
          )}
        </QueryResult>
      </AlertDialogContent>
    </AlertDialog>
  );
}
