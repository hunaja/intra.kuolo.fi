import fetchSession from "@/fetchSession";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import NavigationBar from "@/components/navigation/navigation";
import GetInvitedCard from "@/components/invitations/card";
import { db } from "@/server/db";
import crypto from "crypto";

export const metadata: Metadata = {
  title: "Luo tunnus | KuoLO Ry",
};

export default async function GetInvitedPage() {
  const session = await fetchSession();
  if (session.type !== "inauthenticated") return redirect("/");

  async function action(
    _previous: { error: string | false },
    formData: FormData,
  ): Promise<{ error: string | false }> {
    "use server";
    const email = formData.get("email") as string;

    const member = await db.member.findUnique({
      where: {
        email,
      },
    });
    if (!member) {
      return {
        error: "Member not found",
      };
    }

    const account = await db.account.findUnique({
      where: { email: member.email },
    });

    if (account) {
      return {
        error: "Account already exists",
      };
    }

    const oldInvitation = await db.memberInvitation.findUnique({
      where: {
        memberId: member.id,
      },
    });
    if (!oldInvitation) {
      return {
        error: "Invitation not found",
      };
    }

    await db.memberInvitation.delete({
      where: {
        memberId: member.id,
      },
    });

    const newInvitation = await db.memberInvitation.create({
      data: {
        memberId: member.id,
        token: crypto.randomBytes(32).toString("hex"),
      },
    });

    console.log(newInvitation);

    redirect("/?memberInvited=true");

    return {
      error: false,
    };
  }

  return (
    <>
      <NavigationBar />

      <div className="align-center flex w-full flex-1 flex-col place-items-center justify-center self-center sm:w-96">
        <GetInvitedCard action={action} />
      </div>
    </>
  );
}
