import { Button } from "@/components/ui/button";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  type CollectionFormData,
  collectionSchema,
} from "@/server/api/routers/collection/collection-validators";

type CollectionFormProps = {
  onCancel: () => void;
  onSubmit: SubmitHandler<CollectionFormData>;
  defaultValues?: CollectionFormData;
};

export default function CollectionForm({
  onCancel,
  onSubmit,
  defaultValues = { name: "" },
}: CollectionFormProps) {
  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues,
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Culture" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-x-2">
          <Button onClick={onCancel} variant="secondary" type="button">
            Cancel
          </Button>

          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
