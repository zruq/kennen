import { auth } from "@/server/auth";
import Game from "./_components/Game";
import JoinGame from "./_components/JoinGame";

type Params = Promise<{ room: string }>;

async function GamePage({ params }: { params: Params }) {
  const { room } = await params;
  const session = await auth();
  if (session?.user) {
    return (
      <Game
        room={room}
        user={{ id: session.user.id, name: session.user.name }}
      />
    );
  }
  return <JoinGame />;
}

export default GamePage;
