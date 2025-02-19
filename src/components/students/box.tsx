import {
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/16/solid";
import { Avatar } from "@nextui-org/avatar";
import { Card, CardBody } from "@nextui-org/card";
import type { Member } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { formatClassName, initials } from "../../utils";

export default function StudentBox({
  member,
}: {
  member: Pick<
    Member,
    "fullName" | "classYear" | "email" | "phone" | "phoneHiddenFromList"
  >;
}) {
  return (
    <Card className="mb-5 flex h-[175px] w-full flex-row items-center sm:w-96">
      <div className="p-5">
        <Avatar size="lg" name={initials(member.fullName)} />
      </div>
      <div>
        <CardBody className="">
          <h3 className="pt-2 text-2xl">{member.fullName}</h3>
          <div>
            <div className="flex flex-row place-items-center content-center pt-3">
              <AcademicCapIcon width={10} />
              <span className="pl-2">{formatClassName(member.classYear)}</span>
            </div>

            <div className="flex flex-row place-items-center content-center py-3">
              <EnvelopeIcon width={10} />
              <span className="pl-2">
                <Link href={`mailto:${member.email}`}>{member.email}</Link>
              </span>
            </div>

            {member.phone && !member.phoneHiddenFromList && (
              <div className="flex flex-row place-items-center content-center pb-3">
                <PhoneIcon width={10} />
                <span className="pl-2">
                  <Link href={`tel:${member.phone}`}>{member.phone}</Link>
                </span>
              </div>
            )}
          </div>
        </CardBody>
      </div>
    </Card>
  );
}
