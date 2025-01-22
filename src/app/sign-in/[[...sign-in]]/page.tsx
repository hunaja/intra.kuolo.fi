import NavigationBar from "@/app/_components/navigation";
import StyledSignIn from "@/app/_components/styledSignIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kirjaudu sisään | KuoLO Ry",
};

export default function ClerkSignIn() {
  return (
    <>
      <NavigationBar />
      <div className="flex flex-1 place-content-center items-center justify-center">
        <StyledSignIn />
      </div>
    </>
  );
}
