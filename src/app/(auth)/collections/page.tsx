import { api } from "@/trpc/server";
import Collections from "./_components/collections";

export default async function MyCollectionsPage() {
  const data = await api.collection.mine();
  return (
    <div className="container mx-auto py-10">
      <Collections initialData={data} />
    </div>
  );
}
