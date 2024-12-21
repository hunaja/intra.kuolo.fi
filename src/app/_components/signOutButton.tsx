"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";

export default function StyledSignOutButton() {
  const { signOut } = useClerk();

  return (
    <>
      <Button color="danger" onPress={() => signOut({ redirectUrl: "/" })}>
        Kirjaudu ulos
      </Button>
    </>
  );
}
