import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";

import Image from "next/image";
import type { Session } from "@/fetchSession";
import ThemeSwitcher from "./themeSwitcher";
import UserDropdown from "./userDropdown";

export default function NavigationBar({
  selected,
  session,
}: {
  selected?: "wiki" | "students" | "videos" | "exams" | "admin";
  session?: Session;
}) {
  const loggedIn =
    session && (session.type === "member" || session.type === "guest");

  const userCourseYear =
    session &&
    session.type === "member" &&
    session.classYear !== "alumni" &&
    session.classYear !== "LTn"
      ? session.classYear
      : "LT1";

  return (
    <Navbar shouldHideOnScroll className="mb-5">
      <NavbarContent>
        <NavbarMenuToggle aria-label={"Toggle menu"} className="sm:hidden" />
        <NavbarBrand>
          <Image
            src="/logo.png"
            alt="KuoLO Ry:n logo"
            priority={true}
            className="h-12 w-12"
            width="188"
            height="208"
          />
        </NavbarBrand>
      </NavbarContent>

      {loggedIn && (
        <>
          <NavbarContent className="hidden gap-4 sm:flex" justify="center">
            <NavbarItem isActive={selected === "wiki"}>
              <Link
                color={selected === "wiki" ? "primary" : "foreground"}
                href="/wiki"
              >
                Wiki
              </Link>
            </NavbarItem>
            <NavbarItem isActive={selected === "students"}>
              <Link
                color={selected === "students" ? "primary" : "foreground"}
                href="/students"
              >
                Opiskelijat
              </Link>
            </NavbarItem>
            <NavbarItem isActive={selected === "exams"}>
              <Link
                color={selected === "exams" ? "primary" : "foreground"}
                href={`/exams/${userCourseYear}`}
              >
                Tentit
              </Link>
            </NavbarItem>
            {session.type === "member" && session.admin && (
              <NavbarItem isActive={selected === "admin"}>
                <Link
                  color={selected === "admin" ? "primary" : "foreground"}
                  href="/admin"
                >
                  Ylläpito
                </Link>
              </NavbarItem>
            )}
          </NavbarContent>

          <NavbarMenu>
            <NavbarMenuItem isActive={selected === "wiki"} className="p-2">
              <Link
                color={selected === "wiki" ? "primary" : "foreground"}
                href="/"
                size="lg"
                className="w-full"
              >
                Wiki
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem isActive={selected === "students"} className="p-2">
              <Link
                color={selected === "students" ? "primary" : "foreground"}
                href="/students"
                size="lg"
                className="w-full"
              >
                Opiskelijat
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem isActive={selected === "exams"} className="p-2">
              <Link
                color={selected === "exams" ? "primary" : "foreground"}
                href={`/exams/${userCourseYear}`}
                size="lg"
                className="w-full"
              >
                Tentit
              </Link>
            </NavbarMenuItem>
            {session.type === "member" && session.admin && (
              <NavbarMenuItem isActive={selected === "admin"} className="p-2">
                <Link
                  color={selected === "admin" ? "primary" : "foreground"}
                  href="/admin"
                  size="lg"
                  className="w-full"
                >
                  Ylläpito
                </Link>
              </NavbarMenuItem>
            )}
          </NavbarMenu>
        </>
      )}

      <NavbarContent className="gap-4" justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        {session && session.type !== "inauthenticated" && (
          <NavbarItem>
            <UserDropdown session={session} />
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
