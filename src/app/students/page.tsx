import { api, HydrateClient } from "@/trpc/server";
import NavigationBar from "../_components/navigation";
import fetchSession from "@/fetchSession";
import InauthorizedPage from "../_components/inauthorized";
import StudentList from "../_components/studentList";
import { RedirectToSignIn } from "@clerk/nextjs";
import { Suspense } from "react";
import StudentsPageLoadingView from "./loadingView";

export default async function MembersPage() {
  const session = await fetchSession();
  if (session.type === "inauthenticated") return <RedirectToSignIn />;
  else if (session.type === "inauthorized") return <InauthorizedPage />;

  void api.member.getStudents.prefetchInfinite(
    {
      cursor: undefined,
      fullNameSearch: undefined,
      courses: ["LT1", "LT2", "LT3", "LT4", "LT5", "LT6", "LTn"],
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      pages: 1,
    },
  );

  return (
    <HydrateClient>
      <NavigationBar selected="students" session={session} />
      <Suspense fallback={<StudentsPageLoadingView />}>
        <StudentList />
      </Suspense>
    </HydrateClient>
  );
}