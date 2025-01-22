"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { formatClassName, initials } from "../utils";
import type {
  GuestSession,
  InauthorizedSession,
  MemberSession,
} from "@/fetchSession";
import StyledSignOutButton from "./signOutButton";
import {
  ArrowRightStartOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/16/solid";

export default function UserDropdown({
  session,
}: {
  session: GuestSession | MemberSession | InauthorizedSession;
}) {
  const {
    isOpen: isLogoutOpen,
    onOpen: onLogoutOpen,
    onOpenChange: onLogoutOpenChange,
  } = useDisclosure();

  const name =
    session.type === "inauthorized" ? session.email : session.fullName;

  return (
    <>
      <div className="flex items-center gap-4">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={
                name
                  ? {
                      name: initials(name),
                    }
                  : undefined
              }
              name={name?.split(" ")[0]}
              description={
                session.type === "member"
                  ? session.email.replaceAll("@student.uef.fi", "@uef.fi")
                  : undefined
              }
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="User Actions"
            variant="flat"
            disabledKeys={new Set(["profile"])}
          >
            <DropdownItem key="profile" className="h-14 gap-2 text-sm">
              <p className="font-bold">{name ?? "Tuntematon"}</p>
              <p className="font-bold">
                {session.type !== "member"
                  ? "Vierailija"
                  : `Jäsen, ${formatClassName(session.classYear)}`}
              </p>
            </DropdownItem>
            {session.type === "member" ? (
              <DropdownItem
                key="settings"
                href="/profile"
                startContent={<UserIcon width={15} />}
              >
                Profiili ja yksityisyys
              </DropdownItem>
            ) : null}
            <DropdownItem
              key="logout"
              color="danger"
              onPress={onLogoutOpen}
              startContent={<ArrowRightStartOnRectangleIcon width={15} />}
            >
              Kirjaudu ulos
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Modal
        isOpen={isLogoutOpen}
        onOpenChange={onLogoutOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Kirjaudu ulos
              </ModalHeader>
              <ModalBody>
                <p>
                  Oletko varma, että haluat kirjautua ulos? Voit kirjautua
                  takaisin sisään milloin tahansa.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={close}>
                  Sulje
                </Button>
                <StyledSignOutButton />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
