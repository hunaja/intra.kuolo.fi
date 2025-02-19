"use client";

import { api } from "@/trpc/react";
import { PlusIcon, UsersIcon, XMarkIcon } from "@heroicons/react/16/solid";
import {
  Button,
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
import { useState } from "react";

export default function GuestsModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: guests } = api.guest.getAll.useQuery();
  const createGuest = api.guest.createGuest.useMutation({
    onSuccess: async () => {
      setEmail("");
      setFullName("");
      await utils.guest.getAll.invalidate();
    },
  });
  const deleteGuest = api.guest.deleteGuest.useMutation({
    onSuccess: async () => {
      await utils.guest.getAll.invalidate();
    },
  });
  const utils = api.useUtils();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Button
        type="submit"
        color="primary"
        variant="bordered"
        className="mt-5 w-full sm:w-auto"
        startContent={<UsersIcon width={15} />}
        onPress={onOpen}
      >
        Hallitse vierailijoita
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-center text-2xl">Hallitse vierailijoita</h2>
              </ModalHeader>
              <ModalBody>
                {!!guests?.length && (
                  <Table
                    aria-label="Vierailijakäyttäjät"
                    className="h-52 overflow-scroll"
                  >
                    <TableHeader>
                      <TableColumn>Sähköpostiosoite</TableColumn>
                      <TableColumn>Koko nimi</TableColumn>
                      <TableColumn>Poista</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {guests.map((g) => (
                        <TableRow key={g.id}>
                          <TableCell>{g.email}</TableCell>
                          <TableCell>{g.fullName}</TableCell>
                          <TableCell>
                            <Button
                              variant="light"
                              color="danger"
                              isIconOnly
                              onPress={() => {
                                deleteGuest.mutate(g.id);
                              }}
                            >
                              <XMarkIcon width={15} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {!guests?.length && (
                  <p className="py-5 text-center text-sm">
                    Ei vielä vieraskäyttäjiä.
                  </p>
                )}

                <h2 className="my-2 text-center text-xl">Luo vieraskäyttäjä</h2>

                <div className="mx-5">
                  <Input
                    label="Koko nimi"
                    placeholder="Esim. Töysän Terveyskeskus"
                    value={fullName}
                    onValueChange={setFullName}
                    isRequired={true}
                    labelPlacement="outside"
                  />
                  <div className="pb-5" />
                  <Input
                    label="Sähköpostiosoite"
                    placeholder="Päättyy +org@kuolo.fi"
                    value={email}
                    className="my-2"
                    isRequired={true}
                    onValueChange={setEmail}
                    labelPlacement="outside"
                  />
                  <div className="pb-5" />
                  <Input
                    label="Salasana"
                    placeholder=" "
                    value={password}
                    className="my-2"
                    isRequired={true}
                    onValueChange={setPassword}
                    labelPlacement="outside"
                  />
                  <div className="pb-2" />
                  <Button
                    color="primary"
                    className="w-full"
                    onPress={() => {
                      createGuest.mutate({ fullName, email, password });
                    }}
                    isDisabled={createGuest.isPending}
                    isLoading={createGuest.isPending}
                    startContent={<PlusIcon width={15} />}
                  >
                    Luo
                  </Button>
                </div>
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
