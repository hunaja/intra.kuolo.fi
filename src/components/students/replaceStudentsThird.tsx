import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import type { SelectedColumns } from "./students/replaceAllModal";

export default function ReplaceStudentsThird({
  csvRecords,
  loading,
  columns,
  onSubmit,
}: {
  csvRecords: string[][];
  columns: SelectedColumns;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <>
      <p className="my-5 text-center text-sm">
        Tarkista, että esikatselu uudesta jäsenrekisteristä näyttää hyvältä eli
        olet valinnut oikeat sarakkeet. Jos esikatselussa näkyy duplikaatteja,
        nämä duplikaatit korjataan palvelimella.
      </p>

      <Table aria-label="Esikatselu jäsenrekisteristä">
        <TableHeader>
          <TableColumn>Virallinen kutsumanimi</TableColumn>
          <TableColumn>Sukunimi</TableColumn>
          <TableColumn>Sähköpostiosoite</TableColumn>
          <TableColumn>Kurssiasema</TableColumn>
          <TableColumn>Puhelinnumero</TableColumn>
        </TableHeader>
        <TableBody>
          {csvRecords.slice(2, 12).map((record, i) => (
            <TableRow key={i}>
              {[
                columns.callName,
                columns.lastName,
                columns.email,
                columns.classYear,
                columns.phone,
              ].map((key, j) => (
                <TableCell key={j}>
                  {key && record[csvRecords[1]!.indexOf(key)]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        className="mx-5 my-5"
        color="primary"
        isLoading={loading}
        isDisabled={loading}
        onPress={() => {
          onSubmit();
        }}
      >
        Lähetä jäsenkisteri
      </Button>
    </>
  );
}
