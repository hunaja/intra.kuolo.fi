import fetchSession from "@/fetchSession";
import { redirect } from "next/navigation";
import GetInvitedForm from "../_components/getInvitedForm";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Image from "next/image";

export default async function GetInvitedPage() {
  const session = await fetchSession();
  if (session.type !== "inauthenticated") return redirect("/");

  return (
    <div className="flex flex-1 place-content-center justify-center">
      <Card className="m-10 w-full self-center p-10 sm:m-0 sm:w-96">
        <CardHeader className="justify-center">
          <Image
            src="/logo.png"
            alt="KuoLO Ry:n logo"
            width="188"
            height="208"
            className="w-20 p-4"
          />
          <h1 className="my-5 text-xl sm:text-2xl">Luo tunnus</h1>
        </CardHeader>

        <CardBody className="pt-5">
          <p className="pb-5">
            <strong className="font-bold">Jäsen:</strong> Sinun on käytettävä
            @student.uef.fi-sähköpostiosoitetta, jonka olet syöttänyt
            Kide.appiin.
          </p>
          <p className="pb-5">
            <strong className="font-bold">Alumni:</strong> Sinun on käytettävä
            Kide.appiin syöttämääsi sähköpostiosoitetta.
          </p>

          <GetInvitedForm />
        </CardBody>
      </Card>
    </div>
  );
}
