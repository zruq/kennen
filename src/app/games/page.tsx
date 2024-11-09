import { auth } from "@/server/auth";
import NewGame from "./_components/NewGame";

export default async function GamesPage() {
  const session = await auth();
  return <NewGame username={session?.user?.name ?? undefined} />;
}
