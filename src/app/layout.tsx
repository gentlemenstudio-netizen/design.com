import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import {
  Inter,
  Poppins,
  Montserrat,
  Playfair_Display,
  Raleway,
  Bebas_Neue,
  Oswald,
} from "next/font/google";

import { SubscriptionAlert } from "@/features/subscriptions/components/subscription-alert";
import { auth } from "@/auth";
import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

import "./globals.css";

/* =====================
   Google Fonts (UI)
===================== */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-raleway",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "Gentlemen Designs",
  description: "Build Something Great!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          className={`
            ${inter.variable}
            ${poppins.variable}
            ${montserrat.variable}
            ${playfair.variable}
            ${raleway.variable}
            ${bebas.variable}
            ${oswald.variable}
          `}
        >
          <Providers>
            <Toaster />
            <Modals />
            <SubscriptionAlert />
            {children}
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
