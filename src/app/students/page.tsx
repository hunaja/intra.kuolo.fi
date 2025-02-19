import { api, HydrateClient } from "@/trpc/server";
import fetchSession from "@/fetchSession";
import { Suspense } from "react";
import StudentsPageLoadingView from "./loadingView";
import { studentCourses } from "../../utils";
import type { Metadata } from "next";
import InauthorizedPage from "@/components/inauthorized";
import NavigationBar from "@/components/navigation/navigation";
import StudentList from "@/components/students/list";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: "Opiskelijat | KuoLO Ry",
};

export default async function StudentsPage() {
  const session = await fetchSession();
  if (session.type === "inauthenticated") {
    return redirect("/", RedirectType.replace);
  } else if (session.type === "inauthorized") {
    return <InauthorizedPage />;
  }

  void api.member.getStudents.prefetchInfinite(
    {
      cursor: undefined,
      fullNameSearch: undefined,
      courses: studentCourses,
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
