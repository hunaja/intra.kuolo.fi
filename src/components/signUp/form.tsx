"use client";

import { api } from "@/trpc/react";
import { Button, Input } from "@nextui-org/react";
import { Member, MemberInvitation } from "@prisma/client";
import { startTransition, useActionState, useState } from "react";

export default function SignUpForm({
  invitation,
  action,
}: {
  invitation: MemberInvitation & { member: Member };
  action: (
    previous: { error: string | false },
    formData: FormData,
  ) => Promise<{ error: string | false }>;
}) {
  const [loginStatus, formAction, pending] = useActionState(action, {
    error: false,
  });

  const [passwordTouched, setPasswordTouched] = useState(false);
  const [password2Touched, setPassword2Touched] = useState(false);

  const errorMessage = ({ error }: { error: string | false }) => {
    if (!error) return undefined;

    if (error === "Passwords do not match") {
      return {
        message: "Salasanat eivät täsmää.",
        field: "password2",
      };
    }

    return undefined;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setPasswordTouched(false);
        setPassword2Touched(false);
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
        value={invitation.member.email}
        isDisabled
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
        onFocus={() => setPassword2Touched(true)}
        isInvalid={
          errorMessage(loginStatus)?.field === "password" && !passwordTouched
        }
        errorMessage={
          errorMessage(loginStatus)?.field === "password" &&
          errorMessage(loginStatus)?.message
        }
      />

      <div className="pb-5" />

      <Input
        label="Salasana uudestaan"
        type="password"
        name="password2"
        className="w-full"
        labelPlacement="outside"
        placeholder=" "
        isDisabled={pending}
        isRequired
        onFocus={() => setPasswordTouched(true)}
        isInvalid={
          errorMessage(loginStatus)?.field === "password2" && !password2Touched
        }
        errorMessage={
          errorMessage(loginStatus)?.field === "password2" &&
          errorMessage(loginStatus)?.message
        }
      />

      <Button
        color="primary"
        type="submit"
        className="mt-5 w-full"
        disabled={pending}
        isLoading={pending}
      >
        Kirjaudu sisään
      </Button>
    </form>
  );
}
