// @ts

"use client";
import React from "react";

import { NextUIProvider } from "@nextui-org/react";
import { TRPCReactProvider } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";

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
      <NextUIProvider
        className="flex min-h-full flex-col"
        navigate={router.push}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </NextUIProvider>
    </TRPCReactProvider>
  );
}
