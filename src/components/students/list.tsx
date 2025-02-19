"use client";

import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Input } from "@nextui-org/input";
import React, { useCallback, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { FunnelIcon } from "@heroicons/react/24/solid";
import { ArrowDownIcon } from "@heroicons/react/16/solid";
import MemberBox from "./box";
import { api } from "@/trpc/react";
import MemberBoxSkeleton from "./boxSkeleton";
import { studentCourses, type StudentCourseYear } from "@/utils";

export default function StudentList() {
  const [name, setName] = useState("");
  const [courses, setCourses] = useState<Set<StudentCourseYear>>(
    new Set(studentCourses),
  );
  const observer = useRef<IntersectionObserver | null>(null);

  const [debouncedSettings] = useDebounce<{
    name: string;
    courses: StudentCourseYear[];
  }>(
    {
      name,
      courses: Array.from(courses),
    },
    1500,
    {
      equalityFn: (a, b) =>
        a.name === b.name &&
        JSON.stringify(a.courses) === JSON.stringify(b.courses),
    },
  );

  const [{ pages }, { error, fetchNextPage, hasNextPage, isFetchingNextPage }] =
    api.member.getStudents.useSuspenseInfiniteQuery(
      {
        fullNameSearch: debouncedSettings.name || undefined,
        courses: debouncedSettings.courses,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const lastStudentRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (!hasNextPage || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(([firstEntry]) => {
        if (!firstEntry?.isIntersecting) return;

        void fetchNextPage();
      });

      if (node) observer.current.observe(node);

      return () => {
        if (observer.current) {
          observer.current.disconnect();
        }
      };
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  const students = pages.flatMap((p) => p.data);

  return (
    <>
      <div className="flex flex-grow-0 items-center justify-between px-2 sm:px-4">
        <Input
          value={name}
          size="sm"
          onChange={(e) => {
            setName(e.target.value);
          }}
          label="Hae..."
        />
        <div className="flex-1 pl-5">
          <Dropdown>
            <DropdownTrigger>
              <Button size="lg" color="primary" isIconOnly>
                <FunnelIcon width={15} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Valitse vuosikurssi"
              variant="flat"
              closeOnSelect={false}
              disallowEmptySelection
              selectionMode="multiple"
              selectedKeys={courses} // @ts-expect-error nextui sucks with types
              onSelectionChange={setCourses}
            >
              <DropdownItem key="LT1">1. vsk</DropdownItem>
              <DropdownItem key="LT2">2. vsk</DropdownItem>
              <DropdownItem key="LT3">3. vsk</DropdownItem>
              <DropdownItem key="LT4">4. vsk</DropdownItem>
              <DropdownItem key="LT5">5. vsk</DropdownItem>
              <DropdownItem key="LT6">6. vsk</DropdownItem>
              <DropdownItem key="LTn">n. vsk</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {!error && students.length !== 0 && (
        <ul className="flex-grow basis-0 p-4 sm:p-10">
          {students.map((student, index) => (
            <li
              key={student.email}
              ref={students.length === index + 1 ? lastStudentRef : undefined}
            >
              <MemberBox member={student} />
            </li>
          ))}

          {hasNextPage && isFetchingNextPage && (
            <>
              <MemberBoxSkeleton />
              <MemberBoxSkeleton />
              <MemberBoxSkeleton />
              <MemberBoxSkeleton />
              <MemberBoxSkeleton />
              <MemberBoxSkeleton />
              <MemberBoxSkeleton />
              <MemberBoxSkeleton />
              <MemberBoxSkeleton />
            </>
          )}
        </ul>
      )}

      {hasNextPage && !isFetchingNextPage && (
        <Button
          color="primary"
          onPress={() => fetchNextPage()}
          className="mb-10 self-center"
          startContent={<ArrowDownIcon width={15} />}
          size="lg"
        >
          Lataa lisää
        </Button>
      )}

      {!isFetchingNextPage && students.length === 0 && (
        <div className="flex flex-1 flex-col place-content-center text-center">
          <h1 className="mb-5 text-3xl">Ei tuloksia</h1>
          <p>Ei hakutuloksia. Muuta hakuehtoja.</p>
        </div>
      )}
    </>
  );
}
