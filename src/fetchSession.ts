import "server-only";

import type { Guest, Member } from "@prisma/client";
import { db } from "./server/db";
import { cookies } from "next/headers";
import { getIronSession, type IronSession } from "iron-session";
import { type SessionData, sessionOptions } from "./server/auth";

export type MemberSession = {
  type: "member";
  id: string;
} & Member;

export type GuestSession = {
  type: "guest";
} & Guest;

export type InauthenticatedSession = {
  type: "inauthenticated";
};

export type InauthorizedSession = {
  type: "inauthorized";
  email?: string;
};

export type Session =
  | MemberSession
  | GuestSession
  | InauthenticatedSession
  | InauthorizedSession;

export default async function fetchSession(): Promise<Session> {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );

  const { email, loggedIn } = session;

  if (!loggedIn || !email) {
    return {
      type: "inauthenticated",
    };
  }

  const user = await db.member.findUnique({ where: { email } });
  if (user) return { type: "member", ...user };

  const guest = await db.guest.findUnique({ where: { email } });
  if (guest) return { type: "guest", ...guest };

  return {
    type: "inauthorized",
    email,
  };
}
