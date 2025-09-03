"use client";

import { api } from "@/trpc/react";
import { LockOpenIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import type { Permission } from "@prisma/client";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function PermissionsModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: members } = api.member.getPermittedMembers.useQuery();
  const togglePermission = api.member.togglePermission.useMutation({
    onSuccess: async () => {
      await utils.member.getPermittedMembers.invalidate();
    },
  });
  const utils = api.useUtils();
  const [email, setEmail] = useState("");
  const [debouncedEmail] = useDebounce(email, 2000);
  const { data: memberResult } = api.member.getMemberByEmail.useQuery(
    debouncedEmail,
    {
      enabled: email !== "",
    },
  );

  const onPermissionClick = (id: string, permission: Permission) => {
    togglePermission.mutate({
      id,
      permission,
    });
  };

  return (
    <>
      <Button
        type="submit"
        color="primary"
        variant="bordered"
        className="mt-5 w-full sm:w-auto"
        startContent={<LockOpenIcon width={15} />}
        onPress={onOpen}
      >
        Hallitse oikeuksia
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-center text-2xl">Hallitse oikeuksia</h2>
              </ModalHeader>
              <ModalBody>
                {!!members?.length && (
                  <Table
                    aria-label="Vierailijakäyttäjät"
                    className="h-52 overflow-scroll"
                  >
                    <TableHeader>
                      <TableColumn>Sähköpostiosoite</TableColumn>
                      <TableColumn>Kokeet</TableColumn>
                      <TableColumn>Jäsenet</TableColumn>
                      <TableColumn>Vierailijat</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {members
                        .sort((a, b) => a.id.localeCompare(b.id))
                        .map((g) => (
                          <TableRow key={g.id}>
                            <TableCell>{g.email}</TableCell>
                            <TableCell>
                              <Checkbox
                                onValueChange={() =>
                                  onPermissionClick(g.id, "EDIT_EXAMS")
                                }
                                isSelected={g.permissions.includes(
                                  "EDIT_EXAMS",
                                )}
                                isDisabled={togglePermission.isPending}
                              />
                            </TableCell>
                            <TableCell>
                              <Checkbox
                                onValueChange={() =>
                                  onPermissionClick(g.id, "EDIT_MEMBERS")
                                }
                                isSelected={g.permissions.includes(
                                  "EDIT_MEMBERS",
                                )}
                                isDisabled={togglePermission.isPending}
                              />
                            </TableCell>
                            <TableCell>
                              <Checkbox
                                onValueChange={() =>
                                  onPermissionClick(g.id, "EDIT_GUESTS")
                                }
                                isSelected={g.permissions.includes(
                                  "EDIT_GUESTS",
                                )}
                                isDisabled={togglePermission.isPending}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
                {!members?.length && (
                  <p className="py-5 text-center text-sm">
                    Ei vielä lisättyjä oikeuksia.
                  </p>
                )}

                <h2 className="my-2 text-center text-xl">Anna oikeus</h2>

                <Input
                  label="Sähköpostiosoite"
                  placeholder="Päättyy @student.uef.fi"
                  className="my-2"
                  labelPlacement="outside"
                  onValueChange={setEmail}
                />

                {(!memberResult || memberResult.permissions.length !== 0) && (
                  <p className="py-5 text-center text-sm">
                    Käyttäjää ei löytynyt.
                  </p>
                )}

                {memberResult?.permissions.length === 0 && (
                  <Table
                    aria-label="Vierailijakäyttäjät"
                    className="overflow-scroll"
                  >
                    <TableHeader>
                      <TableColumn>Kokeet</TableColumn>
                      <TableColumn>Jäsenet</TableColumn>
                      <TableColumn>Vierailijat</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Checkbox
                            isDisabled={togglePermission.isPending}
                            onValueChange={() => {
                              onPermissionClick(memberResult.id, "EDIT_EXAMS");
                              setEmail("");
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            isDisabled={togglePermission.isPending}
                            onValueChange={() => {
                              onPermissionClick(
                                memberResult.id,
                                "EDIT_MEMBERS",
                              );
                              setEmail("");
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            isDisabled={togglePermission.isPending}
                            onValueChange={() => {
                              onPermissionClick(memberResult.id, "EDIT_GUESTS");
                              setEmail("");
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={close}>
                  Sulje
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
