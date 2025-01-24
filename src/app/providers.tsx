// @ts

"use client";
import React from "react";

import { NextUIProvider } from "@nextui-org/react";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { fiFI } from "@clerk/localizations";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({
  children,
  cookieHeader,
}: {
  children: React.ReactNode;
  cookieHeader: string | null;
}) {
  const router = useRouter();

  return (
    <TRPCReactProvider cookieHeader={cookieHeader}>
      <ClerkProvider localization={fiFI}>
        <NextUIProvider
          className="flex min-h-full flex-col"
          navigate={router.push}
        >
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
          </ThemeProvider>
        </NextUIProvider>
      </ClerkProvider>
    </TRPCReactProvider>
  );
}
