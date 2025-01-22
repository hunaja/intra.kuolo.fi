import NavigationBar from "@/app/_components/navigation";
import StyledSignUp from "@/app/_components/styledSignUp";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rekisteröidy | KuoLO Ry",
};

export default function ClerkSignUp() {
  return (
    <>
      <NavigationBar />
      <div className="flex flex-1 place-content-center items-center justify-center">
        <StyledSignUp />
      </div>
    </>
  );
}
