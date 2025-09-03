import "server-only";
import { env } from "@/env";
import type { SessionOptions } from "iron-session";

export interface SessionData {
  email: string;
  loggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: env.SESSION_SECRET,
  cookieName: "kuolo-session",
  cookieOptions: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
  },
};
