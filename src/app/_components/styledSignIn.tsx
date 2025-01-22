"use client";

import { dark } from "@clerk/themes";

import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";

export default function StyledSignIn() {
  const { theme } = useTheme();

  return (
    <SignIn
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
