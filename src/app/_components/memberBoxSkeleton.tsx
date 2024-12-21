import { AcademicCapIcon, EnvelopeIcon } from "@heroicons/react/16/solid";
import { Avatar } from "@nextui-org/avatar";
import { Card, CardBody } from "@nextui-org/card";
import React from "react";
import { Skeleton } from "@nextui-org/react";

export default function MemberBoxSkeleton() {
  return (
    <Card className="mb-5 flex h-[175px] w-full flex-row items-center sm:w-96">
      <div className="p-5">
        <Skeleton className="rounded-full">
          <Avatar size="lg" name={"MB"} />
        </Skeleton>
      </div>
      <div>
        <CardBody className="">
          <Skeleton className="rounded-lg">
            <h3 className="pt-2 text-2xl">John Doe</h3>
          </Skeleton>
          <div>
            <div className="flex flex-row place-items-center content-center pt-3">
              <AcademicCapIcon width={10} className="mr-2" />
              <Skeleton className="rounded-lg">
                <span className="pl-2">n.vsk</span>
              </Skeleton>
            </div>

            <div className="flex flex-row place-items-center content-center py-3">
              <EnvelopeIcon width={10} className="mr-2" />
              <Skeleton className="rounded-lg">
                <span className="pl-2">john.doe@example.com</span>
              </Skeleton>
            </div>
          </div>
        </CardBody>
      </div>
    </Card>
  );
}
