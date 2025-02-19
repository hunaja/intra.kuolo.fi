import fetchSession from "@/fetchSession";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import ProfileLoadingView from "./loadingView";
import type { Metadata } from "next";
import NavigationBar from "@/components/navigation/navigation";
import InauthorizedPage from "@/components/inauthorized";
import SelfMemberDetails from "@/components/members/selfDetails";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: "Profiili | KuoLO Ry",
};

export default async function ProfilePage() {
  const session = await fetchSession();
  if (session.type === "inauthenticated") {
    return redirect("/", RedirectType.replace);
  } else if (session.type !== "member") {
    return <InauthorizedPage />;
  }

  void api.member.getSelf.prefetch();

  return (
    <HydrateClient>
      <NavigationBar session={session} />

      <main className="block min-h-full flex-1 flex-row justify-between sm:flex sm:px-10">
        <div className="align-center flex w-full flex-1 flex-col place-items-center justify-center sm:w-96">
          <h1 className={`mb-10 text-center text-3xl`}>
            Profiili ja yksityisyys
          </h1>

          {session.type === "member" && (
            <div className="place-items-center">
              <Suspense fallback={<ProfileLoadingView />}>
                <SelfMemberDetails />
              </Suspense>
            </div>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
