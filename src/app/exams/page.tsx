import fetchSession from "@/fetchSession";
import { RedirectToSignIn } from "@clerk/nextjs";
import InauthorizedPage from "../_components/inauthorized";
import { redirect, RedirectType } from "next/navigation";

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

  return redirect(`/exams/${userCourseYear}`, RedirectType.replace);
}
