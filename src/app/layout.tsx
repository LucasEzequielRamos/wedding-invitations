import type { Metadata } from "next";
import { La_Belle_Aurore } from "next/font/google";

import "./globals.css";

const laBelleAurore = La_Belle_Aurore({
  variable: "--font-la-belle-aurore",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Invitaciones de boda",
  description: "Invitaciones de boda personalizadas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={laBelleAurore.variable}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/wan0tuq.css" />
      </head>

      <body>{children}</body>
    </html>
  );
}
