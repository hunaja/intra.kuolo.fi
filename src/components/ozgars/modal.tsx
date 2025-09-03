"use client";

import { PlusIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { NumberInput } from "@heroui/number-input";

export default function OzgarsModal({
  action,
}: {
  action: (
    previous: { error: string | false },
    formData: FormData,
  ) => Promise<{ error: string | false }>;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        type="submit"
        color="primary"
        variant="bordered"
        className="self-center"
        size="lg"
        isIconOnly
        onPress={onOpen}
      >
        <PlusIcon width={15} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-center text-2xl">Lisää video</h2>
              </ModalHeader>
              <ModalBody>
                <Form action={action}>
                  <Input placeholder="Esim. Leenat" label="Nimi" name="name" />
                  <NumberInput
                    label="Vuosi"
                    name="year"
                    defaultValue={new Date().getFullYear()}
                  />
                  <input type="file" name="thumbnail" />
                  <Button
                    type="submit"
                    color="primary"
                    className="mx-auto mt-5"
                  >
                    Lisää video
                  </Button>
                </Form>
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
