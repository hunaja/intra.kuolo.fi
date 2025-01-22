"use client";

import { AcademicCapIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import CreateCourseForm from "./createCourseForm";
import CreateExamForm from "./createExamForm";
import { api } from "@/trpc/react";
import type { CourseClassYear } from "@prisma/client";
import ExamBox from "./examBox";
import { formatClassName } from "../utils";
import type { GuestSession, MemberSession } from "@/fetchSession";

type Tab = "createCourse" | "createExam";

export function CourseList({
  courseYear,
  session,
}: {
  courseYear: CourseClassYear;
  session: GuestSession | MemberSession;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTab, setSelectedTab] = useState("createExam");

  const [courses] =
    api.course.getCoursesForClassYear.useSuspenseQuery(courseYear);

  return (
    <>
      <div className="flex flex-grow-0 justify-end px-2 sm:px-4">
        <Dropdown>
          <DropdownTrigger>
            <Button
              color="primary"
              startContent={<AcademicCapIcon width={15} />}
            >
              {formatClassName(courseYear)}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            selectedKeys={new Set([courseYear])}
            aria-label="Valitse vuosikurssi"
            selectionMode="single"
          >
            <DropdownItem key="LT1" href="/exams/LT1">
              1. vsk
            </DropdownItem>
            <DropdownItem key="LT2" href="/exams/LT2">
              2. vsk
            </DropdownItem>
            <DropdownItem key="LT3" href="/exams/LT3">
              3. vsk
            </DropdownItem>
            <DropdownItem key="LT4" href="/exams/LT4">
              4. vsk
            </DropdownItem>
            <DropdownItem key="LT5" href="/exams/LT5">
              5. vsk
            </DropdownItem>
            <DropdownItem key="LT6" href="/exams/LT6">
              6. vsk
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {session.type === "member" && (
          <>
            <Button
              color="primary"
              variant="bordered"
              isIconOnly
              className="ml-2"
              onPress={onOpen}
            >
              <PlusCircleIcon width={15} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(close) => (
                  <>
                    <Tabs
                      fullWidth
                      aria-label="Lisää tentti tai kurssi"
                      selectedKey={selectedTab} // @ts-expect-error to be fixed
                      onSelectionChange={setSelectedTab}
                      size="md"
                      className="w-full px-2 pt-10"
                    >
                      <Tab key="createExam" title="Lähetä tenttimateriaalia">
                        {courses ? (
                          <CreateExamForm
                            classYear={courseYear}
                            courses={courses}
                            close={close}
                          />
                        ) : (
                          <p>Ladataan kursseja...</p>
                        )}
                      </Tab>
                      <Tab
                        key="createCourse"
                        title="Lisää kurssi"
                        isDisabled={!session.admin}
                      >
                        <CreateCourseForm
                          close={close}
                          initialClassYear={courseYear}
                        />
                      </Tab>
                    </Tabs>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        )}
      </div>

      {(courses.length === 0 || !courses.find((c) => c.exams.length > 0)) && (
        <div className="flex flex-1 flex-col place-content-center text-center">
          <h1 className="mb-5 text-3xl">Ei tenttejä</h1>
          <p>
            Tälle vuosikurssille ei ole vielä lähetetty tenttejä. Ole
            ensimmäinen!
          </p>
        </div>
      )}

      {courses.length !== 0 && (
        <div className="p-4 sm:p-10">
          <Accordion>
            {courses
              .filter((c) => c.exams.length > 0)
              .map((course) => (
                <AccordionItem
                  key={course.code ?? course.name}
                  title={
                    <h3 className="text-xl">{course.code ?? course.name}</h3>
                  }
                  subtitle={`${course.name}, ${
                    course.exams.length > 1
                      ? `${course.exams.length} tenttiä`
                      : "1 tentti"
                  }`}
                >
                  {course.exams
                    .filter((e) => !e.year)
                    .map((exam) => (
                      <div key={exam.id} className="mb-4">
                        <ExamBox key={exam.id} exam={exam} />
                      </div>
                    ))}
                  {course.exams
                    .filter((e) => e.year)
                    .map((exam) => (
                      <div key={exam.id} className="mb-4">
                        <ExamBox key={exam.id} exam={exam} />
                      </div>
                    ))}
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      )}
    </>
  );
}
