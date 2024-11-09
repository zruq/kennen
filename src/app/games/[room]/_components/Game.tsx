"use client";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import usePartySocket from "partysocket/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type MessageData } from "@/partykit/validators";

type GameUser = {
  id: string;
  name?: string | null | undefined;
  image?: string | null | undefined;
  isReady: boolean;
  score: number;
};

export default function Game({
  room,
  user,
}: {
  room: string;
  user: {
    id: string;
    name: string | null | undefined;
  };
}) {
  const [users, setUsers] = useState<Array<GameUser>>([]);
  const socket = usePartySocket({
    room,
    host: env.NEXT_PUBLIC_PARTYKIT_URL,
    query: { id: user.id, name: user.name },
    id: user.id,

    onMessage(event: MessageEvent<string>) {
      const data = JSON.parse(event.data) as MessageData;
      switch (data.type) {
        case "on-connect-data": {
          setUsers(data.users);
          break;
        }
        case "ready-status-changed": {
          setUsers((users) =>
            users.map((u) =>
              u.id === data.userId ? { ...u, isReady: data.isReady } : u,
            ),
          );
          break;
        }
        case "user-joined": {
          setUsers((users) =>
            users.concat({ ...data.user, isReady: false, score: 0 }),
          );
          break;
        }
        case "user-left": {
          setUsers((users) => users.filter((u) => u.id !== data.userId));
          break;
        }
      }
    },
  });
  return (
    <div className="">
      Game
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Avatar>
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>{" "}
            {user.name}
            <button
              onClick={() => {
                socket.send(JSON.stringify({ action: "toggle-ready" }));
              }}
            >
              <Badge className={user.isReady ? "bg-green-500" : "bg-gray-500"}>
                {user.isReady ? "ready" : "not ready"}
              </Badge>
            </button>
          </li>
        ))}
      </ul>
      <Button
        onClick={() => {
          socket.send(new Date().toISOString());
        }}
      >
        send message
      </Button>
    </div>
  );
}
