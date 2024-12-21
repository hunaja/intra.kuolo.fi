"use client";

import Image from "next/image";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { SignInButton } from "@clerk/nextjs";
import { Link } from "@nextui-org/react";

export default function InauthenticatedPage() {
  return (
    <div className="flex flex-1 place-content-center justify-center">
      <Card className="m-10 w-full self-center px-10 py-5 sm:m-0 sm:w-96">
        <CardHeader className="justify-center">
          <Image
            src="/logo.png"
            alt="KuoLO Ry:n logo"
            width="188"
            height="208"
            className="w-20 p-4"
          />
          <h1 className="my-5 text-xl sm:text-2xl">Jäsensivut</h1>
        </CardHeader>

        <CardBody className="pt-5">
          <p className="mb-5">
            Sinulle on lähetetty kutsu tilin luomiseen jäsensivuille, mikäli
            olet <b className="font-bold">KuoLO Ry:n jäsen tai alumni</b>.
          </p>
          <SignInButton>
            <Button color="primary" className="w-full">
              Kirjaudu sisään
            </Button>
          </SignInButton>
        </CardBody>
        <CardFooter className="flex flex-col place-items-start">
          <p className="">
            Jos et ole saanut kutsua, voit uudelleenlähettää sen{" "}
            <Link href="/get-invited">täältä</Link>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
