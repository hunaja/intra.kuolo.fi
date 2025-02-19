import fetchSession from "@/fetchSession";
import { SessionData, sessionOptions } from "@/server/auth";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await fetchSession();
  if (session.type === "inauthenticated") {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const ironSession = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );

  ironSession.loggedIn = false;
  await ironSession.save();
  ironSession.destroy();

  return NextResponse.json({ success: true });
}
