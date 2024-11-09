"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useState } from "react";
import Game from "./Game";

export default function JoinGame() {
  const { room } = useParams();
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [joinGame, setJoinGame] = useState(false);
  if (joinGame) {
    return <Game room={String(room)} user={{ id: userId, name: username }} />;
  }
  return (
    <div className="">
      <Input value={username} onChange={(e) => setUsername(e.target.value)} />
      <Button
        onClick={() => {
          setUserId(crypto.randomUUID());
          setJoinGame(true);
        }}
      >
        Join
      </Button>
    </div>
  );
}
