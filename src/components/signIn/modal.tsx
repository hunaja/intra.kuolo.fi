"use client";

import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import SignInForm from "./form";

export default function StyledSignIn({
  action,
}: {
  action: (
    previous: { error: string | false },
    formData: FormData,
  ) => Promise<{ error: string | false }>;
}) {
  return (
    <Card className="w-full">
      <CardHeader className="flex-col pt-10 text-center">
        <h1 className={`mb-2 text-center text-2xl`}>Kirjaudu sisään</h1>
        <p className="text-center text-sm text-gray-500">
          Jäsensivuille pääsy vaatii kutsun. Jos sinulla ei ole vielä tunnusta,
          voit pyytää kutsun{" "}
          <Link href="/get-invited" size="sm">
            lomakkeella
          </Link>
          .
        </p>
      </CardHeader>
      <CardBody className="px-10 pb-10">
        <SignInForm action={action} />
      </CardBody>
    </Card>
  );
}
