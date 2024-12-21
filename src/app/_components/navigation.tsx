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
import { Avatar } from "@nextui-org/avatar";
import { initials } from "../utils";
import type { GuestSession, MemberSession } from "@/fetchSession";

export default function NavigationBar({
  selected,
  session,
}: {
  selected: "user" | "students" | "videos" | "exams" | "admin";
  session: MemberSession | GuestSession;
}) {
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

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarItem isActive={selected === "user"}>
          <Link color={selected === "user" ? "primary" : "foreground"} href="/">
            Profiili
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
            href="/exams"
          >
            Tentit
          </Link>
        </NavbarItem>
        {"admin" in session && session.admin && (
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
        <NavbarMenuItem isActive={selected === "user"} className="p-2">
          <Link
            color={selected === "user" ? "primary" : "foreground"}
            href="/"
            size="lg"
            className="w-full"
          >
            Profiili
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
            href="/exams"
            size="lg"
            className="w-full"
          >
            Tentit
          </Link>
        </NavbarMenuItem>
        {"admin" in session && session.admin && (
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

      <NavbarContent className="gap-4" justify="end">
        <NavbarItem>
          <Avatar size="sm" name={initials(session.fullName)} />
        </NavbarItem>
        <NavbarItem className="hidden text-sm sm:block">
          {session.fullName}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
