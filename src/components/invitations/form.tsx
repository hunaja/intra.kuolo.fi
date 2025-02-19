"use client";

import { Button, Input } from "@nextui-org/react";
import { startTransition, useActionState, useState } from "react";

export default function GetInvitedForm({
  action,
}: {
  action: (
    previous: { error: string | false },
    formData: FormData,
  ) => Promise<{ error: string | false }>;
}) {
  const [refreshStatus, formAction, pending] = useActionState(action, {
    error: false,
  });
  const [touched, setTouched] = useState(false);

  const errorMessage = ({ error }: { error: string | false }) => {
    if (!error) return undefined;

    if (error === "Member not found") {
      return {
        message: "Rekisterissä ei ole jäsentä tällä sähköpostilla.",
      };
    } else if (error === "Account already exists") {
      return {
        message: "Käyttäjä on jo luotu tällä sähköpostilla.",
      };
    } else if (error === "Invitation not found") {
      return {
        message: "Tätä käyttäjää ei ole kutsuttu.",
      };
    }

    return undefined;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(false);
        // @ts-expect-error It works!
        const formData = new FormData(e.target);
        startTransition(() => formAction(formData));
      }}
      className="w-full"
    >
      <Input
        label="Sähköposti"
        type="email"
        name="email"
        className="w-full"
        labelPlacement="outside"
        placeholder="esimerkki@student.uef.fi"
        isRequired
        errorMessage={errorMessage(refreshStatus)?.message}
        onFocus={() => setTouched(true)}
        isDisabled={pending}
        isInvalid={!!errorMessage(refreshStatus) && !touched}
      />

      <Button
        color="primary"
        type="submit"
        className="mt-5 w-full"
        isLoading={pending}
        isDisabled={pending}
      >
        Lähetä
      </Button>
    </form>
  );
}
