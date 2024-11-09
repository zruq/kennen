import {
  actionSchema,
  type CurrentQuestion,
  type User,
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
    { isReady: boolean; score: number; answers: Map<string, Array<string>> }
  >;

  constructor(readonly room: Party.Room) {
    this.questions = [];
    this.currentQuestion = null;
    this.gameStarted = false;
    this.users = new Map();
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log("this.room.id:", this.room.id);
    console.log("this.adminId:", this.adminId);
    if (!this.adminId) {
      conn.close(404);
      return;
    }
    if (this.gameStarted) {
      conn.close(401);
      return;
    }

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
        conn.close(401);
        return;
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
    conn.setState({ user });
    this.users.set(user.id, {
      ...user,
      answers: new Map(),
      isReady: false,
      score: 0,
    });
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
    conn.send(
      JSON.stringify({
        type: "on-connect-data",
        users,
        adminId: this.adminId,
        currentQuestion: this.currentQuestion,
      }),
    );
    this.room.broadcast(JSON.stringify({ type: "user-joined", user }), [
      conn.id,
    ]);
  }

  onClose(connection: Party.Connection<{ user: User }>) {
    const user = connection.state?.user;
    if (!user) {
      return;
    }
    this.users.delete(user.id);
    this.room.broadcast(JSON.stringify({ type: "user-left", userId: user.id }));
  }
  async onRequest(req: Party.Request) {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 200 });
    }

    if (
      req.method === "POST" &&
      req.headers.get("Authorization") ===
        `Bearer ${process.env.PARTYKIT_SECRET}`
    ) {
      const data: { questions: Quiz; adminId: string } = await req.json();
      this.questions = data.questions;
      this.adminId = data.adminId;
      return new Response(null, { status: 200 });
    }
    return new Response(null, { status: 401 });
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
        this.room.broadcast(
          JSON.stringify({
            type: "ready-status-changed",
            userId,
            isReady: user.isReady,
          }),
        );
        break;
      }
    }
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
