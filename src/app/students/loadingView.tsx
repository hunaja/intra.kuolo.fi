"use client";

import MemberBoxSkeleton from "@/components/students/boxSkeleton";
import { FunnelIcon } from "@heroicons/react/16/solid";
import { Button, Input } from "@nextui-org/react";

export default function StudentsPageLoadingView() {
  return (
    <>
      <div className="flex flex-grow-0 items-center justify-between px-2 sm:px-4">
        <Input value={""} size="sm" label="Hae..." isDisabled />
        <div className="flex-1 pl-5">
          <Button size="lg" color="primary" isIconOnly isDisabled>
            <FunnelIcon width={15} />
          </Button>
        </div>
      </div>

      <ul className="flex-grow basis-0 overflow-hidden p-4 sm:p-10">
        <MemberBoxSkeleton />
        <MemberBoxSkeleton />
        <MemberBoxSkeleton />
        <MemberBoxSkeleton />
        <MemberBoxSkeleton />
        <MemberBoxSkeleton />
      </ul>
    </>
  );
}
