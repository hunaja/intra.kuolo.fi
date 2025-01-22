"use client";

import { api } from "@/trpc/react";
import { Button, Input } from "@nextui-org/react";
import { Formik, type FormikHelpers } from "formik";

export default function GetInvitedForm() {
  const createInvitation = api.member.createInvitation.useMutation();

  const onSubmit = async (
    { email }: { email: string },
    helpers: FormikHelpers<{ email: string }>,
  ) => {
    await helpers.setTouched({});
    createInvitation.mutate(email);
  };

  const errorMessage = (
    e: Exclude<typeof createInvitation.error, null>,
  ): string => {
    if (e.data?.code === "NOT_FOUND") {
      return "Jäsentä ei löytynyt. Tarkista, että käytät Kide.appissa ilmoittamaasi sähköpostiosoitetta. Jäsenillä tämä päättyy @student.uef.fi.";
    } else if (e.data?.code === "CONFLICT") {
      if (e.message === "Member account already exists") {
        return "Käyttäjä on jo olemassa. Jos olet unohtanut salasanasi, voit palauttaa sen kirjautumissivulla.";
      } else if (e.message === "Invitation already sent") {
        return "Kutsu on jo lähetetty kuukauden sisällä. Tarkista sähköpostisi, myös roskaposti.";
      }
    }

    return "Tuntematon virhe. Otathan yhteyttä itvastaava@kuolo.fi, jos virhe toistuu.";
  };

  return (
    <Formik initialValues={{ email: "" }} onSubmit={onSubmit}>
      {({ values, handleChange, handleSubmit, handleBlur, touched }) => (
        <form onSubmit={handleSubmit} className="w-full">
          <Input
            label="Sähköposti"
            type="email"
            name="email"
            value={values.email}
            className="w-full"
            labelPlacement="outside"
            placeholder="esimerkki@student.uef.fi"
            onChange={handleChange("email")}
            onBlur={handleBlur("email")}
            isDisabled={createInvitation.isPending}
            isRequired
            isInvalid={createInvitation.isError && !touched.email}
            errorMessage={
              createInvitation.isError
                ? errorMessage(createInvitation.error)
                : undefined
            }
            description={
              createInvitation.isSuccess ? "Kutsu lähetetty." : undefined
            }
          />

          <Button
            color="primary"
            type="submit"
            className="mt-5 w-full"
            disabled={createInvitation.isPending}
          >
            Lähetä
          </Button>
        </form>
      )}
    </Formik>
  );
}
