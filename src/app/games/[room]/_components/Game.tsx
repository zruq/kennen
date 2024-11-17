"use client";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import usePartySocket from "partysocket/react";
import { useState } from "react";
import {
  type QuestionWithoutCorrectOptions,
  type MessageData,
  type OnConnectMessageData,
} from "@/partykit/validators";
import Question, { type CorrectAnswer, type UsersAnswers } from "./Question";
import Players from "./Players";
import { useRouter } from "next/navigation";

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
  const [gameStarted, setGameStarted] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [timeleft, setTimeleft] = useState<number | null>(null);
  const [question, setQuestion] =
    useState<QuestionWithoutCorrectOptions | null>(null);
  const [usersAnswers, setUsersAnswers] = useState<UsersAnswers>(null);
  const [correctAnswer, setCorrectAnswer] = useState<CorrectAnswer>(null);

  const [players, setPlayers] = useState<Players>([]);
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
      switch (data.type) {
        case "on-connect-data": {
          setPlayers(data.users);
          setAdminId(data.adminId);
          break;
        }
        case "game-started": {
          setGameStarted(true);
          break;
        }
        case "ready-status-changed": {
          setPlayers((players) =>
            players.map((u) =>
              u.id === data.userId ? { ...u, isReady: data.isReady } : u,
            ),
          );
          break;
        }
        case "user-joined": {
          setPlayers((players) =>
            players.concat({ ...data.user, isReady: false, score: 0 }),
          );
          break;
        }
        case "user-left": {
          setPlayers((players) => players.filter((u) => u.id !== data.userId));
          break;
        }
        case "new-question": {
          setCorrectAnswer(null);
          setUsersAnswers(null);
          setQuestion(data.question);
          setTimeleft(data.timeleft);
          break;
        }
        case "timeleft-changed": {
          setTimeleft(data.timeleft);
          break;
        }
        case "scores-updated": {
          setPlayers((players) =>
            players.map((player) => {
              const userScore = data.scores.find((p) => p.userId === player.id);
              if (userScore !== undefined) {
                return {
                  ...player,
                  score: userScore.score,
                };
              }
              return player;
            }),
          );
          break;
        }
        case "question-answers": {
          const usersAnswers: UsersAnswers = new Map();
          data.answers.forEach(({ users, optionId }) => {
            usersAnswers.set(
              optionId,
              users.map((u) => players.find((p) => p.id === u)!),
            );
          });
          setCorrectAnswer(data.correctAnswer);
          setUsersAnswers(usersAnswers);
          break;
        }
      }
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
