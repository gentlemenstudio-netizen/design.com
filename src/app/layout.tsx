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
  title: "Logomust.com",
  description: "AI-powered logo design and branding tools for creators. Transform your ideas into stunning logos, business cards, and more with our intuitive platform. Start building your brand identity today!",
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
