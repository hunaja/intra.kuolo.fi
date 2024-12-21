import type { MemberClassYear } from "@prisma/client";

export const initials = (name: string) =>
  name
    .split(" ")
    .map((s) => s[0])
    .join("");

export const formatClassName = (className: MemberClassYear) => {
  return className === "alumni" ? "Alumni" : className.substring(2) + ". vsk";
};
