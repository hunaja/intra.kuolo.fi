import { Button, Select, SelectItem } from "@nextui-org/react";
import type { SelectedColumns, SelectedColumnsForm } from "./replaceAllModal";
import { useState } from "react";

export default function ReplaceStudentsSecond({
  csvRecords,
  columnsForm,
  onSubmit,
}: {
  csvRecords: string[][];
  columnsForm: SelectedColumnsForm;
  onSubmit: (columns: SelectedColumns) => void;
}) {
  const [callName, setCallName] = useState<Set<string>>(
    new Set(columnsForm.callName ? [columnsForm.callName] : []),
  );
  const [lastName, setLastName] = useState<Set<string>>(
    new Set(columnsForm.lastName ? [columnsForm.lastName] : []),
  );
  const [email, setEmail] = useState<Set<string>>(
    new Set(columnsForm.email ? [columnsForm.email] : []),
  );
  const [classYear, setClassYear] = useState<Set<string>>(
    new Set(columnsForm.classYear ? [columnsForm.classYear] : []),
  );
  const [phone, setPhone] = useState<Set<string>>(
    new Set(columnsForm.phone ? [columnsForm.phone] : []),
  );
  const [disclosedInfo, setDisclosedInfo] = useState<Set<string>>(
    new Set(columnsForm.disclosedInfo ? [columnsForm.disclosedInfo] : []),
  );

  const callNameString = [...callName][0];
  const lastNameString = [...lastName][0];
  const emailString = [...email][0];
  const classYearString = [...classYear][0];
  const phoneString = [...phone][0];
  const disclosedInfoString = [...disclosedInfo][0];

  const columns = csvRecords[1]!.slice(10);

  return (
    <>
      <p className="my-5 text-center text-sm">
        Täsmää opiskelijan tieto oikeaan sarakkeeseen.
      </p>

      <div className="mx-5 pb-2">
        <Select
          label="Virallinen kutsumanimi"
          isRequired={true}
          labelPlacement="outside"
          selectedKeys={callName}
          size="sm"
          // @ts-expect-error jooh :D
          onSelectionChange={setCallName}
          placeholder="Etunimi/etunimet"
        >
          {columns.map((column) => (
            <SelectItem key={column}>{column}</SelectItem>
          ))}
        </Select>

        <div className="pb-5" />

        <Select
          label="Sukunimi"
          size="sm"
          isRequired={true}
          labelPlacement="outside"
          selectedKeys={lastName}
          // @ts-expect-error jooh :D
          onSelectionChange={setLastName}
          placeholder="Sukunimi"
        >
          {columns.map((column) => (
            <SelectItem key={column}>{column}</SelectItem>
          ))}
        </Select>

        <div className="pb-5" />

        <Select
          label="Sähköpostiosoite @student.uef.fi"
          isRequired={true}
          labelPlacement="outside"
          size="sm"
          selectedKeys={email}
          // @ts-expect-error jooh :D
          onSelectionChange={setEmail}
          placeholder="Sähköpostiosoite"
        >
          {columns.map((column) => (
            <SelectItem key={column}>{column}</SelectItem>
          ))}
        </Select>

        <div className="pb-5" />

        <Select
          label="Kurssiasema"
          isRequired={true}
          labelPlacement="outside"
          size="sm"
          selectedKeys={classYear}
          // @ts-expect-error jooh :D
          onSelectionChange={setClassYear}
          placeholder="Kurssiasema"
        >
          {columns.map((column) => (
            <SelectItem key={column}>{column}</SelectItem>
          ))}
        </Select>

        <div className="pb-5" />

        <Select
          label="Puhelinnumero"
          isRequired={true}
          labelPlacement="outside"
          size="sm"
          selectedKeys={phone}
          // @ts-expect-error jooh :D
          onSelectionChange={setPhone}
          placeholder="Puhelinnumero"
        >
          {columns.map((column) => (
            <SelectItem key={column}>{column}</SelectItem>
          ))}
        </Select>

        <div className="pb-5" />

        <Select
          label="Sallin seuraavien tietojen luovuttamista osoiteluetteloon:"
          isRequired={true}
          labelPlacement="outside"
          size="sm"
          selectedKeys={disclosedInfo}
          // @ts-expect-error jooh :D
          onSelectionChange={setDisclosedInfo}
          placeholder="Sallin seuraavien tietojen luovuttamista osoiteluetteloon:"
        >
          {columns.map((column) => (
            <SelectItem key={column}>{column}</SelectItem>
          ))}
        </Select>
      </div>

      <Button
        className="mx-5 my-2"
        color="primary"
        isDisabled={
          !callNameString ||
          !lastNameString ||
          !emailString ||
          !classYearString ||
          !phoneString ||
          !disclosedInfoString
        }
        onPress={() => {
          if (
            !callNameString ||
            !lastNameString ||
            !emailString ||
            !classYearString ||
            !phoneString ||
            !disclosedInfoString
          )
            return;

          onSubmit({
            callName: callNameString,
            lastName: lastNameString,
            email: emailString,
            classYear: classYearString,
            phone: phoneString,
            disclosedInfo: disclosedInfoString,
          });
        }}
      >
        Valmis
      </Button>
    </>
  );
}
