"use client";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button, Link } from "@nextui-org/react";

export default function IndexButtons() {
  return (
    <>
      <SignedOut>
        <SignInButton>
          <Button color="primary" className="">
            Kirjaudu sisään
          </Button>
        </SignInButton>
        <p className="mt-5 text-sm">
          <Link href="/get-invited">Luo tunnus</Link>
        </p>
      </SignedOut>
      <SignedIn>
        <Link href="/wiki">
          <Button color="primary">Astu sisään</Button>
        </Link>
      </SignedIn>
    </>
  );
}
