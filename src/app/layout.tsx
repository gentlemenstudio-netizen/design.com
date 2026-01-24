import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { SubscriptionAlert } from "@/features/subscriptions/components/subscription-alert";
import { auth } from "@/auth";
import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

import "./globals.css";
import { FONT_VARIABLES } from "@/lib/brand-fonts";


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
        <body className={FONT_VARIABLES}>
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
