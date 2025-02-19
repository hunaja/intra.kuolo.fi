import { ArrowUpTrayIcon } from "@heroicons/react/16/solid";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { parse as parseCsv } from "csv";
import type { SelectedColumnsForm } from "./replaceAllModal";

export default function ReplaceStudentsFirst({
  onSubmit,
}: {
  onSubmit: (records: string[][], columnsForm: SelectedColumnsForm) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();

  return (
    <>
      <p className="my-5 text-center text-sm">
        Ohje opiskelijarekisterin päivityksestä jäsensivuille on Docsissa, joka
        on jaettu hallitukselle.
      </p>

      {error && (
        <div className="mb-5 text-center text-red-500">Virhe: {error}</div>
      )}

      <Button
        as="label"
        htmlFor="file"
        color="primary"
        className="mx-5 mb-5"
        isLoading={loading}
        isDisabled={loading}
        startContent={<ArrowUpTrayIcon width={15} />}
      >
        Lähetä .csv-tiedosto
      </Button>
      <input
        type="file"
        id="file"
        onChange={async (e) => {
          const file = e.target?.files?.[0];
          if (!file?.name.endsWith(".csv")) return;

          setLoading(true);

          const content = await file.arrayBuffer();
          const encodedContent = new TextDecoder("windows-1252").decode(
            content,
          );

          parseCsv(
            encodedContent,
            {
              delimiter: ",",
              encoding: "utf8",
            },
            (err: unknown, records: string[][]) => {
              if (err instanceof Error) {
                setLoading(false);
                setError("Virhe: " + err.message);
                console.error(err);
                return;
              } else if (err) {
                setError("Tuntematon virhe");
              }

              if (records.length <= 2) {
                setLoading(false);
                setError("Tiedostossa ei ole tarpeeksi rivejä.");
                return;
              }

              const columns = records[1]!;

              onSubmit(records, {
                callName: columns.includes("Virallinen kutsumanimi")
                  ? "Virallinen kutsumanimi"
                  : undefined,
                disclosedInfo: columns.includes(
                  "Sallin seuraavien tietojen luovuttamista osoiteluetteloon:",
                )
                  ? "Sallin seuraavien tietojen luovuttamista osoiteluetteloon:"
                  : undefined,
                email: columns.includes("Sähköpostiosoite @student.uef.fi")
                  ? "Sähköpostiosoite @student.uef.fi"
                  : undefined,
                lastName: columns.includes("Sukunimi") ? "Sukunimi" : undefined,
                phone: columns.includes("Puhelinnumero")
                  ? "Puhelinnumero"
                  : undefined,
                classYear: columns.includes("Kurssiasema")
                  ? "Kurssiasema"
                  : undefined,
              });
            },
          );
        }}
        className="hidden"
      />
    </>
  );
}
