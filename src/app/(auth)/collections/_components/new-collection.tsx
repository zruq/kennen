"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { z } from "zod";
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
import { api } from "@/trpc/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function NewCollection() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon /> New Collection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
          <NewCollectionForm onClose={() => setOpen(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

const newCollectionSchema = z.object({
  name: z.string().min(2).max(50),
});

type NewCollectionFormData = z.infer<typeof newCollectionSchema>;

type NewCollectionFormProps = {
  onClose: () => void;
};

function NewCollectionForm({ onClose }: NewCollectionFormProps) {
  const utils = api.useUtils();
  const { mutateAsync } = api.collection.create.useMutation();
  const form = useForm<NewCollectionFormData>({
    resolver: zodResolver(newCollectionSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit: SubmitHandler<NewCollectionFormData> = async (values) => {
    await mutateAsync(values);
    await utils.collection.mine.invalidate();
    onClose();
  };
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
          <Button onClick={onClose} variant="secondary" type="button">
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
