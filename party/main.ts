import {
  actionSchema,
  type CurrentQuestion,
  type GameStartedMessageData,
  type MessageData,
  type NewQuestionMessageData,
  type OnConnectMessageData,
  type QuestionAnswersMessageData,
  type ScoreUpdatedMessageData,
  type TimeLeftChangedMessageData,
  type User,
  type UserJoinedMessageData,
  type UserLeftMessageData,
} from "@/partykit/validators";
import type { Quiz } from "@/server/api/routers/game/create-game";
import type { Session } from "next-auth";
import type * as Party from "partykit/server";

export default class GameRoomServer implements Party.Server {
  questions: Quiz;
  currentQuestion: CurrentQuestion;
  gameStarted: boolean;
  adminId?: string;
  users: Map<
    string,
    { isReady: boolean; score: number; answers: Map<number, Array<number>> }
  >;

  constructor(readonly room: Party.Room) {
    this.questions = [];
    this.currentQuestion = null;
    this.gameStarted = false;
    this.users = new Map();
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    if (!this.adminId) {
      conn.close(404);
      return;
    }

    const user = await this.getUser(ctx);

    if (!user) {
      conn.close(401);
      return;
    }

    if (this.gameStarted && !this.users.has(user.id)) {
      conn.close(401);
      return;
    }

    conn.setState({ user });

    if (!this.users.has(user.id)) {
      this.users.set(user.id, {
        answers: new Map(),
        isReady: false,
        score: 0,
      });
    }

    const userJoinedMessage: UserJoinedMessageData = {
      type: "user-joined",
      user,
    };
    this.room.broadcast(JSON.stringify(userJoinedMessage), [conn.id]);

    const connections = this.room.getConnections<{ user: User }>();
    const users: Array<User & { isReady: boolean; score: number }> = [];
    for (const connection of connections) {
      if (connection.state?.user) {
        const user = this.users.get(connection.state.user.id);
        if (!user) {
          continue;
        }
        users.push({
          id: connection.state.user.id,
          name: connection.state.user.name,
          image: connection.state.user.image,
          isReady: user.isReady,
          score: user.score,
        });
      }
    }

    const onConnectMessage: OnConnectMessageData = {
      type: "on-connect-data",
      users,
      adminId: this.adminId,
    };
    conn.send(JSON.stringify(onConnectMessage));
  }

  onClose(connection: Party.Connection<{ user: User }>) {
    if (this.gameStarted) {
      return;
    }
    const user = connection.state?.user;
    if (!user) {
      return;
    }
    this.users.delete(user.id);
    const userLeftMessage: UserLeftMessageData = {
      type: "user-left",
      userId: user.id,
    };
    this.room.broadcast(JSON.stringify(userLeftMessage));
  }

  async onRequest(req: Party.Request) {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 200 });
    }
    if (
      req.headers.get("Authorization") !==
      `Bearer ${process.env.PARTYKIT_SECRET}`
    ) {
      return new Response(null, { status: 401 });
    }
    if (req.method === "POST") {
      const data: { questions: Quiz; adminId: string } = await req.json();
      this.questions = data.questions;
      this.adminId = data.adminId;
      return new Response(null, { status: 200 });
    }
    return new Response(null, { status: 404 });
  }

  onMessage(message: string, sender: Party.Connection<{ user: User }>) {
    const result = actionSchema.safeParse(JSON.parse(message));
    if (!result.success || !sender.state?.user) {
      return;
    }

    const userId = sender.state.user.id;
    switch (result.data.action) {
      case "toggle-ready": {
        if (this.gameStarted) {
          return;
        }
        const user = this.users.get(userId);
        if (!user) {
          return;
        }
        user.isReady = !user.isReady;
        const messageData: Extract<
          MessageData,
          { type: "ready-status-changed" }
        > = {
          type: "ready-status-changed",
          userId,
          isReady: user.isReady,
        };
        this.room.broadcast(JSON.stringify(messageData));
        break;
      }
      case "start-game": {
        if (this.gameStarted || this.adminId !== userId) {
          return;
        }

        const areAllUsersReady = Array.from(this.users.values()).every(
          (u) => u.isReady,
        );
        if (!areAllUsersReady) {
          return;
        }
        this.gameStarted = true;
        const gameStartedMessage: GameStartedMessageData = {
          type: "game-started",
        };
        this.room.broadcast(JSON.stringify(gameStartedMessage));
        this.newQuestion();
        break;
      }
      case "answer-question": {
        const { questionId, optionId } = result.data;
        const user = this.users.get(userId);
        if (!user) {
          return;
        }
        const question = this.questions.find((q) => q.id === questionId);
        if (!question) {
          return;
        }
        const selectedOption = question.options.find(
          (option) => option.id === optionId,
        );
        if (!selectedOption) {
          return;
        }
        user.answers.set(questionId, [optionId]);
        break;
      }
    }
  }

  newQuestion() {
    if (!this.currentQuestion) {
      this.currentQuestion = { index: 0, timeLeft: 5 };
    } else {
      this.currentQuestion.index++;
      this.currentQuestion.timeLeft = 5;
    }
    const question = this.questions?.[this.currentQuestion.index];
    if (!question) {
      this.currentQuestion = null;
      return;
    }
    const messageData: NewQuestionMessageData = {
      type: "new-question",
      question: {
        ...question,
        options: question.options.map(({ isCorrect: _, ...option }) => option),
      },
      timeleft: this.currentQuestion.timeLeft,
    };
    this.room.broadcast(JSON.stringify(messageData));
    const intervalId = setInterval(() => {
      if (!this.currentQuestion) {
        clearInterval(intervalId);
        return;
      }
      if (this.currentQuestion.timeLeft === 0) {
        this.updateScores();
      }
      if (this.currentQuestion.timeLeft === -5) {
        this.newQuestion();
        clearInterval(intervalId);
      }

      this.currentQuestion.timeLeft--;
      const messageData: TimeLeftChangedMessageData = {
        type: "timeleft-changed",
        timeleft: this.currentQuestion.timeLeft,
      };
      this.room.broadcast(JSON.stringify(messageData));
    }, 1000);
  }

  updateScores() {
    if (!this.currentQuestion) {
      return;
    }
    const question = this.questions?.[this.currentQuestion.index];
    if (!question) {
      return;
    }

    const correctOptions = question.options.filter(
      (option) => option.isCorrect,
    );

    const scores: ScoreUpdatedMessageData["scores"] = [];
    const questionAnswers: QuestionAnswersMessageData["answers"] =
      question.options.map((o) => ({ optionId: o.id, users: [] }));

    for (const connection of this.room.getConnections<{
      user: User;
    }>()) {
      const userId = connection.state?.user.id;
      if (!userId) {
        continue;
      }

      const user = this.users.get(userId);
      if (!user) {
        continue;
      }

      const answers = user.answers.get(question.id);
      if (!answers) {
        continue;
      }
      answers.forEach((answer) => {
        questionAnswers.find((a) => a.optionId === answer)?.users?.push(userId);
      });

      const isCorrect =
        answers.length === correctOptions.length &&
        correctOptions.every((option) => answers.includes(option.id)) &&
        answers.every((optionId) =>
          correctOptions.some((option) => option.id === optionId),
        );

      if (isCorrect) {
        user.score += 100;
      }

      scores.push({ userId, score: user.score });
    }

    const messageData: ScoreUpdatedMessageData = {
      type: "scores-updated",
      scores,
    };
    this.room.broadcast(JSON.stringify(messageData));

    const answersMessageData: QuestionAnswersMessageData = {
      type: "question-answers",
      answers: questionAnswers,
      correctAnswer: correctOptions.map((o) => o.id),
    };
    this.room.broadcast(JSON.stringify(answersMessageData));
  }

  async getUser(ctx: Party.ConnectionContext): Promise<User | null> {
    const cookie = ctx.request.headers.get("cookie");
    const sessionToken = getCookie("authjs.session-token", cookie);
    let user: User;
    if (cookie && sessionToken) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/auth/session`,
        {
          headers: {
            cookie,
          },
        },
      );
      if (!res.ok) {
        return null;
      }
      const session = (await res.json()) as Session;
      user = {
        id: session.user.id,
        name: session.user.name,
        image: session.user.image,
      };
    } else {
      const userId = new URL(ctx.request.url).searchParams.get("id") ?? "";
      const userName = new URL(ctx.request.url).searchParams.get("name") ?? "";

      user = { id: userId, name: userName };
    }
    return user;
  }
}

GameRoomServer satisfies Party.Worker;

function getCookie(name: string, cookies: string | null) {
  if (!cookies) return null;

  const regex = new RegExp("(^|;)\\s*" + name + "=([^;]*)");
  const match = cookies.match(regex);
  if (match?.[2]) {
    return decodeURIComponent(match[2]);
  }
  return null;
}
