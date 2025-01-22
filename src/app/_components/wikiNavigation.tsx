"use client";

import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";

export default function WikiNavigation() {
  return (
    <Listbox
      selectedKeys={new Set(["yleista"])}
      selectionMode="single"
      className="p-4"
      disallowEmptySelection
      topContent={<div className="p-4 text-center text-lg font-bold">Wiki</div>}
    >
      <ListboxItem key="yleista" value="yleista">
        Jäsenedut
      </ListboxItem>
      <ListboxItem key="kysta" value="tentit">
        Kysta
      </ListboxItem>
      <ListboxItem key="paku" value="tentit">
        Pakun vuokraus
      </ListboxItem>
      <ListboxItem key="fimsic" value="tentit">
        FiMSIC-vaihtoon
      </ListboxItem>
      <ListboxSection title="Tapahtumat">
        <ListboxItem key="tkt" value="tkt">
          Pukukoodit
        </ListboxItem>
        <ListboxItem key="mat" value="mat">
          Bile-etiketti
        </ListboxItem>
        <ListboxItem key="fy" value="fy">
          Vuosijuhlaetiketti
        </ListboxItem>
      </ListboxSection>
      <ListboxSection title="KuoLO:n säännöt">
        <ListboxItem key="tkta" value="tkt">
          Yhdistyksen säännöt
        </ListboxItem>
        <ListboxItem key="mata" value="mat">
          Strategia
        </ListboxItem>
        <ListboxItem key="fya" value="fy">
          Kokousten pöytäkirjat
        </ListboxItem>
      </ListboxSection>
    </Listbox>
  );
}
