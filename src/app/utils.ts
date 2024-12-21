import type { MemberClassYear } from "@prisma/client";

export const initials = (name: string) =>
  name
    .split(" ")
    .map((s) => s[0])
    .join("");

export type StudentCourseYear =
  | "LT1"
  | "LT2"
  | "LT3"
  | "LT4"
  | "LT5"
  | "LT6"
  | "LTn";

export const studentCourses: StudentCourseYear[] = [
  "LT1",
  "LT2",
  "LT3",
  "LT4",
  "LT5",
  "LT6",
  "LTn",
];

export const formatClassName = (className: MemberClassYear) => {
  return className === "alumni" ? "Alumni" : className.substring(2) + ". vsk";
};

export const isStudentCourseYear = (s: string): s is StudentCourseYear =>
  studentCourses.includes(s as StudentCourseYear);
