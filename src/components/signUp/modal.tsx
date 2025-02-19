"use client";

import { Card, CardBody, CardHeader, useDisclosure } from "@nextui-org/react";
import { Member, MemberInvitation } from "@prisma/client";
import SignUpForm from "./form";
import { formatClassName } from "@/utils";

export default function StyledSignUp({
  invitation,
  action,
}: {
  invitation: MemberInvitation & { member: Member };
  action: (
    previous: { error: string | false },
    formData: FormData,
  ) => Promise<{ error: string | false }>;
}) {
  return (
    <Card className="w-full">
      <CardHeader className="flex-col pt-10 text-center">
        <h1 className={`mb-2 text-center text-2xl`}>Luo tili</h1>
        <p className="text-center text-sm text-gray-500">
          Luo tili jäsenelle{" "}
          <b className="font-bold">{invitation.member.fullName}</b>,{" "}
          {formatClassName(invitation.member.classYear)}
        </p>
      </CardHeader>
      <CardBody className="px-10 pb-10">
        <SignUpForm invitation={invitation} action={action} />
      </CardBody>
    </Card>
  );
}
