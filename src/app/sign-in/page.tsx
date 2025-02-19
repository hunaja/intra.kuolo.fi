import NavigationBar from "@/components/navigation/navigation";
import StyledSignIn from "@/components/signIn/modal";
import fetchSession from "@/fetchSession";
import { db } from "@/server/db";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "@/server/auth";

export const metadata: Metadata = {
  title: "Kirjaudu sisään | KuoLO Ry",
};

export default async function SignInPage() {
  const session = await fetchSession();
  if (session.type !== "inauthenticated") {
    return redirect("/");
  }

  async function action(
    _previous: { error: string | false },
    formData: FormData,
  ): Promise<{ error: string | false }> {
    "use server";

    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await db.account.findUnique({
      where: { email },
    });
    if (!user) {
      return {
        error: "Account not found",
      };
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return {
        error: "Wrong password",
      };
    }

    // Save the session
    session.loggedIn = true;
    session.email = email;
    await session.save();

    redirect("/wiki");

    return {
      error: false,
    };
  }

  return (
    <>
      <NavigationBar />

      <div className="align-center flex w-full flex-1 flex-col place-items-center justify-center self-center sm:w-96">
        <StyledSignIn action={action} />
      </div>
    </>
  );
}
