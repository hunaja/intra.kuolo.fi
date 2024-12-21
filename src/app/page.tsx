import NavigationBar from "./_components/navigation";
import SignOutModal from "./_components/signOutModal";
import fetchSession from "../fetchSession";
import InauthenticatedPage from "./_components/inauthenticated";
import InauthorizedPage from "./_components/inauthorized";
import { api, HydrateClient } from "@/trpc/server";
import SelfMemberDetails from "./_components/selfMemberDetails";
import { Suspense } from "react";
import MemberLoadingView from "@/loadingView";

export default async function Home() {
  const session = await fetchSession();
  if (session.type === "inauthenticated") {
    return <InauthenticatedPage />;
  } else if (session.type === "inauthorized") {
    return <InauthorizedPage />;
  }

  if (session.type === "member") {
    void api.member.getSelf.prefetch();
  }

  return (
    <HydrateClient>
      <NavigationBar selected="user" session={session} />

      <main className="block min-h-full flex-1 flex-row justify-between sm:flex sm:px-10">
        <div className="align-center flex w-full flex-1 flex-col place-items-center justify-center sm:w-96">
          <h1
            className={`${session.type === "guest" ? "mb-5" : "mb-10"} text-center text-3xl`}
          >
            {session.type === "guest"
              ? `Tervetuloa ${session.fullName}!`
              : `Profiili`}
          </h1>

          {session.type === "member" && (
            <div className="place-items-center">
              <Suspense fallback={<MemberLoadingView />}>
                <SelfMemberDetails />
              </Suspense>
            </div>
          )}

          <SignOutModal />
        </div>
      </main>
    </HydrateClient>
  );
}
