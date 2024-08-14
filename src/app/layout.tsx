import * as React from 'react'
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ weight: ['400', '900'], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Superviz",
  description: "Generated with <3 by Superviz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <main>
          {children}
        </main>
      </body>
    </html>
);
}
