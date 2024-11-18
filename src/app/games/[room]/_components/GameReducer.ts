import type {
  MessageData,
  OnConnectMessageData,
  QuestionWithoutCorrectOptions,
} from "@/partykit/validators";
import type { CorrectAnswer, UsersAnswers } from "./Question";

type GameState = {
  gameStarted: boolean;
  adminId: string | null;
  timeleft: number | null;
  question: QuestionWithoutCorrectOptions | null;
  usersAnswers: UsersAnswers;
  correctAnswer: CorrectAnswer;
  players: OnConnectMessageData["users"];
};

export function reducer(state: GameState, data: MessageData): GameState {
  switch (data.type) {
    case "on-connect-data": {
      return { ...state, players: data.users, adminId: data.adminId };
    }
    case "game-started": {
      return { ...state, gameStarted: true };
    }
    case "ready-status-changed": {
      return {
        ...state,
        players: state.players.map((u) =>
          u.id === data.userId ? { ...u, isReady: data.isReady } : u,
        ),
      };
    }
    case "user-joined": {
      return {
        ...state,
        players: state.players.concat({
          ...data.user,
          isReady: false,
          score: 0,
        }),
      };
    }
    case "user-left": {
      return {
        ...state,
        players: state.players.filter((u) => u.id !== data.userId),
      };
    }
    case "new-question": {
      return {
        ...state,
        correctAnswer: null,
        usersAnswers: null,
        question: data.question,
        timeleft: data.timeleft,
      };
    }
    case "timeleft-changed": {
      return { ...state, timeleft: data.timeleft };
    }
    case "scores-updated": {
      return {
        ...state,
        players: state.players.map((player) => {
          const userScore = data.scores.find((p) => p.userId === player.id);
          if (userScore !== undefined) {
            return {
              ...player,
              score: userScore.score,
            };
          }
          return player;
        }),
      };
    }
    case "question-answers": {
      const usersAnswers: UsersAnswers = new Map();
      data.answers.forEach(({ users, optionId }) => {
        usersAnswers.set(
          optionId,
          users.map((u) => state.players.find((p) => p.id === u)!),
        );
      });
      return { ...state, correctAnswer: data.correctAnswer, usersAnswers };
    }
  }
}
