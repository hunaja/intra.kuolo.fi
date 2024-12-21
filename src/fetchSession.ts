import type { Guest, Member } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "./server/db";

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
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return {
      type: "inauthenticated",
    };
  }

  const email = clerkUser.emailAddresses.find(
    (e) => e.verification?.status === "verified",
  )?.emailAddress;

  if (!email) {
    return {
      type: "inauthorized",
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
