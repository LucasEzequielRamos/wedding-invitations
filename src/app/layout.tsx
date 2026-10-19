
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
  metadataBase: new URL("https://invitacionesberacah.vercel.app"),
  title: "Beracah Studio | Invitaciones & Papelería",
  description: "Invitaciones de boda y papelería personalizada.",

  icons: {
    icon: "/images/og-beracah.png",
  },

  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Beracah Studio",
    title: "Beracah Studio | Invitaciones & Papelería",
    description: "Invitaciones de boda y papelería personalizada.",
    url: "/",
    images: [
      {
        url: "/images/og-beracah.png", 
        width: 1200,
        height: 630,
        alt: "Beracah Studio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Beracah Studio | Invitaciones & Papelería",
    description: "Invitaciones de boda y papelería personalizada.",
    images: ["/images/og-beracah.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={laBelleAurore.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/wan0tuq.css"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
