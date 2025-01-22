"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import GetInvitedForm from "./getInvitedForm";

export default function GetInvitedCard() {
  return (
    <Card className="w-full">
      <CardHeader className="flex-col pt-10 text-center">
        <h1 className={`mb-2 text-center text-2xl`}>Luo tunnus</h1>
        <p className="text-center text-sm text-gray-500">
          Jäsensivuille pääsy vaatii kutsun. Jos sinulla ei ole vielä tunnusta,
          voit pyytää kutsun alla olevalla lomakkeella.
        </p>
      </CardHeader>
      <CardBody className="px-10 pb-10">
        <GetInvitedForm />
      </CardBody>
    </Card>
  );
}
