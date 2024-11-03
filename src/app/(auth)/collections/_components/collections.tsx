"use client";
import { type RouterOutput } from "@/server/api/root";
import { api } from "@/trpc/react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type CollectionsProps = {
  initialData: RouterOutput["collection"]["mine"];
};
export default function Collections({ initialData }: CollectionsProps) {
  const { data, isLoading, error } = api.collection.mine.useQuery(undefined, {
    initialData,
  });

  if (isLoading) {
    return "loading";
  }
  if (error) {
    return error.message;
  }
  return <DataTable columns={columns} data={data} />;
}
