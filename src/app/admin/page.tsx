import fetchSession from "@/fetchSession";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import NavigationBar from "@/components/navigation/navigation";
import { ExamList } from "@/components/exams/modList";
import GuestsModal from "@/components/guests/modal";
import ReplaceStudentsModal from "@/components/students/replaceAllModal";

export const metadata: Metadata = {
  title: "Ylläpito | KuoLO Ry",
};

export default async function AdminPage() {
  const session = await fetchSession();
  if (
    session.type === "inauthenticated" ||
    session.type === "inauthorized" ||
    session.type !== "member" ||
    !session.admin
  )
    return redirect("/");

  void api.exam.getAllInvisible.prefetch();

  return (
    <HydrateClient>
      <NavigationBar selected="admin" session={session} />

      <div className="block flex-1 justify-between p-4 sm:flex sm:p-10">
        <div className="flex-grow">
          <Suspense fallback={<Spinner className="flex-1" />}>
            <ExamList />{" "}
          </Suspense>
        </div>
        <div className="ml-0 flex-grow-0 sm:ml-5">
          <h1 className="text-3xl font-bold">Toiminnat</h1>
          <GuestsModal />
          <br />
          <ReplaceStudentsModal />
        </div>
      </div>
    </HydrateClient>
  );
}
