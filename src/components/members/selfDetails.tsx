"use client";

import { api } from "@/trpc/react";
import PhoneVisibilitySwitch from "./phoneSwitch";
import MemberBox from "../students/box";
import VisibilitySwitch from "./visibilitySwitch";

export default function SelfMemberDetails() {
  const [member] = api.member.getSelf.useSuspenseQuery();

  if (!member) return <p>Käyttäjääsi ei löytynyt tiedokannasta.</p>;

  return (
    <>
      <MemberBox member={member} />

      {member.classYear !== "alumni" && (
        <>
          <PhoneVisibilitySwitch hidden={member.phoneHiddenFromList} />
          <br />
          <VisibilitySwitch hidden={member.hiddenFromList} />
        </>
      )}
    </>
  );
}
