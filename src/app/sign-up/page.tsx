import NavigationBar from "@/components/navigation/navigation";
import StyledSignUp from "@/components/signUp/modal";
import { SessionData, sessionOptions } from "@/server/auth";
import { db } from "@/server/db";
import { getIronSession } from "iron-session";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import fetchSession from "@/fetchSession";

const HASH_ROUNDS = 10;

export const metadata: Metadata = {
  title: "Luo tili | KuoLO Ry",
};

export default async function SignUp({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await fetchSession();
  if (session.type !== "inauthenticated") return redirect("/");

  const token = searchParams?.token;
  if (typeof token !== "string") {
    return <p>Kutsukoodi on annettava.</p>;
  }

  const monthAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
  const invitation = await db.memberInvitation.findUnique({
    where: {
      token,
      createdAt: { gte: monthAgo },
    },
    include: {
      member: true,
    },
  });

  if (!invitation) {
    return <p>Virheellinen tai vanhentunut kutsu.</p>;
  }

  async function action(
    _previous: { error: string | false },
    formData: FormData,
  ): Promise<{ error: string | false }> {
    "use server";
    if (!invitation) return { error: "No invitation" };

    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("password2") as string;

    if (password !== confirmPassword) {
      return {
        error: "Passwords do not match",
      };
    }

    await db.memberInvitation.delete({
      where: { token: invitation.token },
    });

    const hashedPassword = await bcrypt.hash(password, HASH_ROUNDS);
    await db.account.create({
      data: {
        email: invitation.member.email,
        password: hashedPassword,
      },
    });

    session.loggedIn = true;
    session.email = invitation.member.email;
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
        <StyledSignUp invitation={invitation} action={action} />
      </div>
    </>
  );
}
