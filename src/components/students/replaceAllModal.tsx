"use client";

import { AcademicCapIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import ReplaceStudentsFirst from "./replaceAllFirst";
import ReplaceStudentsSecond from "./replaceStudentsSecond";
import ReplaceStudentsThird from "./replaceStudentsThird";
import { api } from "@/trpc/react";
import type { StudentCourseYear } from "../../utils";

export interface SelectedColumns {
  callName: string;
  lastName: string;
  email: string;
  classYear: string;
  phone: string;
  disclosedInfo: string;
}

export type SelectedColumnsForm = Partial<SelectedColumns>;

export default function ReplaceStudentsModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [csvRecords, setCsvRecords] = useState<string[][] | null>(null);

  const [columnsForm, setColumnsForm] = useState<SelectedColumnsForm | null>(
    null,
  );
  const [columns, setColumns] = useState<SelectedColumns | null>(null);
  const replaceStudents = api.member.replaceStudents.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  return (
    <>
      <Button
        type="submit"
        color="danger"
        variant="bordered"
        className="mt-5 w-full sm:w-auto"
        startContent={<AcademicCapIcon width={15} />}
        onPress={onOpen}
      >
        Päivitä opiskelijat
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-center text-2xl">Päivitä opiskelijat</h2>
              </ModalHeader>
              <ModalBody>
                {!columnsForm && (
                  <ReplaceStudentsFirst
                    onSubmit={(csvRecords, columnsForm) => {
                      setCsvRecords(csvRecords);
                      setColumnsForm(columnsForm);
                    }}
                  />
                )}

                {columnsForm && csvRecords && !columns && (
                  <ReplaceStudentsSecond
                    columnsForm={columnsForm}
                    csvRecords={csvRecords}
                    onSubmit={(columns) => {
                      setColumns(columns);
                    }}
                  />
                )}

                {columns && csvRecords && (
                  <ReplaceStudentsThird
                    csvRecords={csvRecords}
                    columns={columns}
                    loading={replaceStudents.isPending}
                    onSubmit={() => {
                      const students = csvRecords.slice(2).map((record) => {
                        const allColumns = csvRecords[1]!;
                        const callName =
                          record[allColumns.indexOf(columns.callName)]!;
                        const lastName =
                          record[allColumns.indexOf(columns.lastName)]!;
                        const email =
                          record[allColumns.indexOf(columns.email)]!;
                        const classYear =
                          record[allColumns.indexOf(columns.classYear)]!;
                        const phone =
                          record[allColumns.indexOf(columns.phone)]!;
                        const disclosedInfo =
                          record[allColumns.indexOf(columns.disclosedInfo)]!;

                        return {
                          lastName,
                          callName,
                          email,
                          classYear: classYear as StudentCourseYear,
                          phone,
                          disclosedInfo,
                        };
                      });

                      replaceStudents.mutate(students);
                    }}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                {csvRecords && (
                  <Button
                    variant="light"
                    className="text-gray-400"
                    onPress={() => {
                      setColumns(null);
                      setColumnsForm(null);
                      setCsvRecords(null);
                    }}
                  >
                    Takaisin
                  </Button>
                )}
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
