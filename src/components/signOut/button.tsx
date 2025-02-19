"use client";

import { api } from "@/trpc/react";
import { Button } from "@nextui-org/button";

export default function StyledSignOutButton() {
  const logOut = () => {
    fetch("/api/sign-out", { method: "POST" }).then(() => {
      window.location.replace("/");
    });
  };

  return (
    <>
      <Button color="danger" onPress={() => logOut()}>
        Kirjaudu ulos
      </Button>
    </>
  );
}
