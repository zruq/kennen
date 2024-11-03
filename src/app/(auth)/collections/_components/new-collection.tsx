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
import { type SubmitHandler } from "react-hook-form";
import { api } from "@/trpc/react";
import { useState } from "react";
import CollectionForm from "./collection-form";
import type { CollectionFormData } from "@/server/api/routers/collection/collection-validators";

export default function NewCollection() {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();
  const { mutateAsync } = api.collection.create.useMutation();
  const onSubmit: SubmitHandler<CollectionFormData> = async (values) => {
    await mutateAsync(values);
    await utils.collection.mine.invalidate();
    setOpen(false);
  };

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
          <CollectionForm onCancel={() => setOpen(false)} onSubmit={onSubmit} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
