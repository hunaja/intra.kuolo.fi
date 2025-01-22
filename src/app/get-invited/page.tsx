import fetchSession from "@/fetchSession";
import { redirect } from "next/navigation";
import NavigationBar from "../_components/navigation";
import GetInvitedCard from "../_components/getInvitedCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luo tunnus | KuoLO Ry",
};

export default async function GetInvitedPage() {
  const session = await fetchSession();
  if (session.type !== "inauthenticated") return redirect("/");

  return (
    <>
      <NavigationBar />

      <div className="align-center flex w-full flex-1 flex-col place-items-center justify-center self-center sm:w-96">
        <GetInvitedCard />
      </div>
    </>
  );
}
