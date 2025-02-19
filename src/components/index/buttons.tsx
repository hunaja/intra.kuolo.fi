"use client";
import { Button, Link } from "@nextui-org/react";
import { useEffect } from "react";

export default function IndexButtons() {
  return (
    <>
      <Link href="/sign-in">
        <Button color="primary" href="/sign-in">
          Kirjaudu sisään
        </Button>
      </Link>
      <p className="mt-5 text-sm">
        <Link href="/get-invited">Luo tunnus</Link>
      </p>
    </>
  );
}
