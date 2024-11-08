import * as React from "react";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { RealtimeProvider } from "@/contexts/realtime-context";

const roboto = Roboto({ weight: ["400", "700", "900"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Superviz",
  description: "Generated with <3 by Superviz",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RealtimeProvider>
      <html lang="pt-BR">
        <body className={roboto.className}>
          <main>{children}</main>
        </body>
      </html>
    </RealtimeProvider>
  );
}
