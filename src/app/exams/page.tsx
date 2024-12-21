import fetchSession from "@/fetchSession";
import { RedirectToSignIn } from "@clerk/nextjs";
import InauthorizedPage from "../_components/inauthorized";
import { api, HydrateClient } from "@/trpc/server";
import { CourseList } from "../_components/courseList";
import { Suspense } from "react";
import ExamsPageLoadingView from "./loadingView";
import NavigationBar from "../_components/navigation";

export default async function ExamsPage() {
  const session = await fetchSession();
  if (session.type === "inauthenticated") return <RedirectToSignIn />;
  else if (session.type === "inauthorized") return <InauthorizedPage />;

  const userCourseYear =
    session.type === "member" &&
    session.classYear !== "alumni" &&
    session.classYear !== "LTn"
      ? session.classYear
      : "LT1";

  void api.course.getCoursesForClassYear.prefetch(userCourseYear);

  return (
    <HydrateClient>
      <NavigationBar selected="exams" session={session} />

      <Suspense fallback={<ExamsPageLoadingView session={session} />}>
        <CourseList initialCourseYear={userCourseYear} session={session} />
      </Suspense>
    </HydrateClient>
  );
}
