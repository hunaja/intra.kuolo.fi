"use client";
import React from "react";

import { NextUIProvider } from "@nextui-org/react";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { fiFI } from "@clerk/localizations";

export function Providers({
  children,
  cookieHeader,
}: {
  children: React.ReactNode;
  cookieHeader: string | null;
}) {
  return (
    <TRPCReactProvider cookieHeader={cookieHeader}>
      <ClerkProvider localization={fiFI}>
        <NextUIProvider className="flex min-h-full flex-col">
          {children}
        </NextUIProvider>
      </ClerkProvider>
    </TRPCReactProvider>
  );
}
