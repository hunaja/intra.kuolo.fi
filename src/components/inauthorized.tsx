import Image from "next/image";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import StyledSignOutButton from "./signOut/button";

export default async function InauthorizedPage() {
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
          <h1 className="my-5 text-xl sm:text-2xl">Ei pääsyä</h1>
        </CardHeader>

        <CardBody className="pt-5">
          <p className="pb-5">
            Sinun on luotava käyttäjäsi @student.uef.fi-sähköpostiosoitteella,
            joka löytyy jäsenrekisteristä.
          </p>

          <StyledSignOutButton />
        </CardBody>
      </Card>
    </div>
  );
}
