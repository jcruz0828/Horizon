export const dynamic = 'force-dynamic'
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import {Inter,IBM_Plex_Serif} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets:['latin'],variable: '--font-inter'})
const imbPlexSerif = IBM_Plex_Serif({subsets:['latin'],weight:['400','700'],variable:'--font-ibm-plex-serif'
})

export const metadata: Metadata = {
  title: "Horizon",
  description: "Horizon is a modern banking platforn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${imbPlexSerif.variable}`}
      >
        {children}
        <Analytics></Analytics>
      </body>
    </html>
  );
}
