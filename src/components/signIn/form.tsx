"use client";

import { Button, Input } from "@nextui-org/react";
import { startTransition, useActionState, useState } from "react";

export default function SignInForm({
  action,
}: {
  action: (
    previous: { error: string | false },
    formData: FormData,
  ) => Promise<{ error: string | false }>;
}) {
  const [loginStatus, formAction, pending] = useActionState(action, {
    error: false,
  });

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const errorMessage = ({ error }: { error: string | false }) => {
    if (!error) return undefined;

    if (error === "Account not found") {
      return {
        message:
          "Tätä käyttäjää ei löytynyt. Muistithan pyytää kutsulinkin, jos sinulla ei sitä vielä ole?",
        field: "email",
      };
    } else if (error === "Wrong password") {
      return {
        message: "Salasana on väärin. Tarkista, että kirjoitit sen oikein.",
        field: "password",
      };
    }

    return undefined;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setEmailTouched(false);
        setPasswordTouched(false);
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
        isDisabled={pending}
        onFocus={() => setEmailTouched(true)}
        isRequired
        isInvalid={
          errorMessage(loginStatus)?.field === "email" && !emailTouched
        }
        errorMessage={
          errorMessage(loginStatus)?.field === "email" &&
          errorMessage(loginStatus)?.message
        }
      />

      <div className="pb-5" />

      <Input
        label="Salasana"
        type="password"
        name="password"
        className="w-full"
        labelPlacement="outside"
        placeholder=" "
        isDisabled={pending}
        isRequired
        onFocus={() => setPasswordTouched(true)}
        isInvalid={
          errorMessage(loginStatus)?.field === "password" && !passwordTouched
        }
        errorMessage={
          errorMessage(loginStatus)?.field === "password" &&
          errorMessage(loginStatus)?.message
        }
      />

      <Button
        color="primary"
        type="submit"
        className="mt-5 w-full"
        disabled={pending}
      >
        Kirjaudu sisään
      </Button>
    </form>
  );
}
