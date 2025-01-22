import { CourseList } from "@/app/_components/courseList";
import InauthorizedPage from "@/app/_components/inauthorized";
import NavigationBar from "@/app/_components/navigation";
import { formatClassName, isStudentCourseYear } from "@/app/utils";
import fetchSession from "@/fetchSession";
import { HydrateClient, api } from "@/trpc/server";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect, RedirectType } from "next/navigation";
import { Suspense } from "react";
import ExamsPageLoadingView from "../loadingView";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseYear: string }>;
}): Promise<Metadata> {
  const { courseYear } = await params;

  if (!isStudentCourseYear(courseYear) || courseYear === "LTn") {
    return {
      title: "Tentit | KuoLO Ry",
    };
  }

  return {
    title: `Tentit, ${formatClassName(courseYear)} | KuoLO Ry`,
  };
}

export default async function CourseYearExamsPage({
  params,
}: {
  params: Promise<{ courseYear: string }>;
}) {
  const { courseYear } = await params;

  const session = await fetchSession();
  if (session.type === "inauthenticated") return <RedirectToSignIn />;
  else if (session.type === "inauthorized") return <InauthorizedPage />;

  const isValidYear = isStudentCourseYear(courseYear) && courseYear !== "LTn";
  if (!isValidYear) {
    return redirect("/exams", RedirectType.replace);
  }

  void api.course.getCoursesForClassYear.prefetch(courseYear);

  return (
    <HydrateClient>
      <NavigationBar selected="exams" session={session} />

      <Suspense fallback={<ExamsPageLoadingView session={session} />}>
        <CourseList courseYear={courseYear} session={session} />
      </Suspense>
    </HydrateClient>
  );
}
