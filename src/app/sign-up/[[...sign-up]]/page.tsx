import { SignUp } from "@clerk/nextjs";

export default function ClerkSignIn() {
  return (
    <div className="flex flex-1 place-content-center items-center justify-center">
      <SignUp />
    </div>
  );
}