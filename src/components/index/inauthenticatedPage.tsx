"use client";

import { Button } from "@nextui-org/button";
import { SignInButton } from "@clerk/nextjs";
import { Link } from "@nextui-org/react";
import NavigationBar from "../navigation/navigation";

export default function InauthenticatedPage() {
  return (
    <>
      <NavigationBar />

      <main className="block min-h-full flex-1 flex-row justify-between sm:flex sm:px-10">
        <div className="align-center flex w-full flex-1 flex-col place-items-center justify-center sm:w-96">
          <h1 className={`mb-10 text-center text-3xl`}>Jäsensivut</h1>
          <SignInButton>
            <Button color="primary" className="">
              Kirjaudu sisään
            </Button>
          </SignInButton>
          <p className="mt-5 text-sm">
            <Link href="/get-invited">Luo tunnus</Link>
          </p>
        </div>
      </main>
    </>
  );
}
