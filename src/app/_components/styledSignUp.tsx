"use client";

import { dark } from "@clerk/themes";

import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";

export default function StyledSignUp() {
  const { theme } = useTheme();

  return (
    <SignUp
      appearance={
        theme === "dark"
          ? {
              baseTheme: dark,
            }
          : undefined
      }
    />
  );
}
