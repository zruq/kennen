import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { OnConnectMessageData } from "@/partykit/validators";
import { CrownIcon } from "lucide-react";

type PlayersProps = {
  players: OnConnectMessageData["users"];
  gameStarted: boolean;
  adminId: string | null;
  currentPlayerId: string;
  onReadyToggle: () => void;
};

export default function Players({
  players,
  gameStarted,
  adminId,
  onReadyToggle,
  currentPlayerId,
}: PlayersProps) {
  return (
    <div className="rounded-xl bg-gray-100 p-2">
      <h3 className="pb-4 text-center text-sm font-medium text-gray-500">
        Players
      </h3>
      <ul className="space-y-3">
        {players.map((player) => (
          <li key={player.id} className="flex items-center gap-x-4">
            <Avatar>
              <AvatarImage src={player.image ?? undefined} />
              <AvatarFallback>
                {player?.name?.slice(0, 2) ?? "AN"}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <p className="flex items-center gap-x-1 text-sm text-gray-700">
                {player.name ?? "Anonymous"}{" "}
                {player.id === adminId && (
                  <CrownIcon className="h-4 w-4 text-yellow-500" />
                )}
              </p>
              {gameStarted ? (
                <p>{player.score}</p>
              ) : (
                <button
                  disabled={player.id !== currentPlayerId}
                  onClick={onReadyToggle}
                  className="disabled:cursor-default"
                >
                  <Badge
                    className={player.isReady ? "bg-green-500" : "bg-gray-500"}
                  >
                    {player.isReady ? "ready" : "not ready"}
                  </Badge>
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
