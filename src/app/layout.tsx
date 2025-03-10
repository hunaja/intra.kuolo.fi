import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "./providers";
import { headers as nextHeaders } from "next/headers";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "KuoLO Ry",
  description: "KuoLO Ry:n jäsensivut",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headers = await nextHeaders();
  const cookieHeader = headers.get("cookie");

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${roboto.className} h-full`}>
        <Providers cookieHeader={cookieHeader}>{children}</Providers>
      </body>
    </html>
  );
}
