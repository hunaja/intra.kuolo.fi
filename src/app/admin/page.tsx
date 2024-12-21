import fetchSession from "@/fetchSession";
import { RedirectToSignIn } from "@clerk/nextjs";
import { api, HydrateClient } from "@/trpc/server";
import NavigationBar from "../_components/navigation";
import { ExamList } from "../_components/examList";
import { Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await fetchSession();
  if (session.type === "inauthenticated") return <RedirectToSignIn />;
  else if (
    session.type === "inauthorized" ||
    session.type !== "member" ||
    !session.admin
  )
    return redirect("/");

  void api.exam.getAllInvisible.prefetch();

  return (
    <HydrateClient>
      <NavigationBar selected="admin" session={session} />

      <Suspense fallback={<Spinner className="flex-1" />}>
        <ExamList />
      </Suspense>
    </HydrateClient>
  );
}
