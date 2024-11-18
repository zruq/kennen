"use client";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import usePartySocket from "partysocket/react";
import { useReducer } from "react";
import {
  type MessageData,
  type OnConnectMessageData,
} from "@/partykit/validators";
import Question from "./Question";
import Players from "./Players";
import { useRouter } from "next/navigation";
import { reducer } from "./GameReducer";

type Players = OnConnectMessageData["users"];

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
  const router = useRouter();
  const [
    {
      players,
      correctAnswer,
      usersAnswers,
      question,
      timeleft,
      adminId,
      gameStarted,
    },
    dispatch,
  ] = useReducer(reducer, {
    gameStarted: false,
    adminId: null,
    timeleft: null,
    question: null,
    usersAnswers: null,
    correctAnswer: null,
    players: [],
  });

  const socket = usePartySocket({
    room,
    host: env.NEXT_PUBLIC_PARTYKIT_URL,
    query: { id: user.id, name: user.name },

    onClose(event) {
      console.log("event:", event);
      router.replace("/games");
    },

    onMessage(event: MessageEvent<string>) {
      const data = JSON.parse(event.data) as MessageData;
      dispatch(data);
    },
  });

  const isAdmin = user.id === adminId;

  return (
    <div className="flex gap-x-4">
      <div className="flex-1">
        {isAdmin && !gameStarted && (
          <Button
            onClick={() => {
              socket.send(JSON.stringify({ action: "start-game" }));
            }}
          >
            Start Game
          </Button>
        )}
        {question && (
          <Question
            {...question}
            timeleft={timeleft}
            canAnswer={timeleft !== null && timeleft > 0}
            onAnswer={(optionId) => {
              socket.send(
                JSON.stringify({
                  action: "answer-question",
                  questionId: question.id,
                  optionId,
                }),
              );
            }}
            usersAnswers={usersAnswers}
            correctAnswer={correctAnswer}
          />
        )}
      </div>
      <Players
        players={players}
        onReadyToggle={() => {
          socket.send(JSON.stringify({ action: "toggle-ready" }));
        }}
        gameStarted={gameStarted}
        currentPlayerId={user.id}
        adminId={adminId}
      />
    </div>
  );
}
