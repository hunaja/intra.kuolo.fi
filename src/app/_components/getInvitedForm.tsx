"use client";

import { api } from "@/trpc/react";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";

export default function GetInvitedForm() {
  const createInvitation = api.member.createInvitation.useMutation();

  const onSubmit = async (
    { email }: { email: string },
    helpers: {
      setFieldError: (field: string, message: string | undefined) => void;
    },
  ) => {
    try {
      await createInvitation.mutateAsync(email);
    } catch (e) {
      if (
        typeof e === "object" &&
        e &&
        "code" in e &&
        e.code === "CONFLICT" &&
        "message" in e
      ) {
        if (e.message === "User already exists") {
          helpers.setFieldError(
            "email",
            "Käyttäjä on jo olemassa. Jos olet unohtanut salasanasi, voit palauttaa sen kirjautumissivulla.",
          );
        } else if (e.message === "Invitation already sen") {
          helpers.setFieldError(
            "email",
            "Kutsu on jo lähetetty kuukauden sisällä. Tarkista sähköpostisi, myös roskaposti.",
          );
        } else {
          helpers.setFieldError(
            "email",
            "Tuntematon virhe. Otathan yhteyttä itvastaava@kuolo.fi, jos virhe toistuu.",
          );
        }
      } else {
        helpers.setFieldError(
          "email",
          "Tuntematon virhe. Otathan yhteyttä itvastaava@kuolo.fi, jos virhe toistuu.",
        );
      }
    }
  };

  return (
    <Formik initialValues={{ email: "" }} onSubmit={onSubmit}>
      {({ values, handleChange, handleSubmit, handleBlur }) => (
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange("email")}
            onBlur={handleBlur("email")}
          />
          <Button color="primary" type="submit">
            Lähetä kutsu
          </Button>
        </form>
      )}
    </Formik>
  );
}
