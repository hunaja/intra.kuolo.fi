import InauthorizedPage from "@/components/inauthorized";
import fetchSession from "@/fetchSession";
import { redirect, RedirectType } from "next/navigation";

export default async function ExamsPage() {
  const session = await fetchSession();
  if (session.type === "inauthenticated") {
    return redirect("/", RedirectType.replace);
  } else if (session.type === "inauthorized" || session.type === "guest") {
    return <InauthorizedPage />;
  }

  const userCourseYear =
    session.type === "member" &&
    session.classYear !== "alumni" &&
    session.classYear !== "LTn"
      ? session.classYear
      : "LT1";

  return redirect(`/exams/${userCourseYear}`, RedirectType.replace);
}
