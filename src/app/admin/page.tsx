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
import { Permission } from "@prisma/client";
import PermissionsModal from "@/components/permissions/modal";

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

  if (session.permissions.includes(Permission.EDIT_EXAMS)) {
    void api.exam.getAllInvisible.prefetch();
  }

  return (
    <HydrateClient>
      <NavigationBar selected="admin" session={session} />

      <div className="block flex-1 justify-between p-4 sm:flex sm:p-10">
        <div className="flex-grow">
          {(session.permissions.includes(Permission.EDIT_EXAMS) ||
            session.admin) && (
            <Suspense fallback={<Spinner className="flex-1" />}>
              <ExamList />{" "}
            </Suspense>
          )}
        </div>
        <div className="ml-0 flex-grow-0 sm:ml-5">
          <h1 className="text-3xl font-bold">Toiminnat</h1>

          {session.admin && (
            <>
              <PermissionsModal />
              <br />
            </>
          )}
          {(session.permissions.includes(Permission.EDIT_GUESTS) ||
            session.admin) && (
            <>
              <GuestsModal />
              <br />
            </>
          )}
          {(session.permissions.includes(Permission.EDIT_MEMBERS) ||
            session.admin) && (
            <>
              <ReplaceStudentsModal />
              <br />
            </>
          )}
        </div>
      </div>
    </HydrateClient>
  );
}
