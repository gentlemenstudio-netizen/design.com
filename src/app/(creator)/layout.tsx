import { Metadata } from "next/types";
import { Providers } from "@/components/providers";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { FONT_VARIABLES } from "@/lib/brand-fonts";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { LoadingBar } from "@/components/ui/loading-bar";



export const metadata: Metadata = {
    title: "Logomust.com - Identity Crafted In Minutes.",
    description: "AI-powered logo design and branding tools for creators. Transform your ideas into stunning logos, business cards, and more with our intuitive platform. Start building your brand identity today!",
};


interface CreatorLayoutProps {
    children: React.ReactNode;
}

const CreatorLayout = async ({ children }: CreatorLayoutProps) => {
    const session = await auth();
    return (
        <SessionProvider session={session}>
            <html lang="en">
                <body className={FONT_VARIABLES}>
                    <Providers>
                        {/* Wrapper background set to Black to match Navbar */}
                        <div className="bg-black h-screen flex flex-col">
                            <LoadingBar />
                            <Navbar />
                            <main className="flex-1 bg-white overflow-auto lg:rounded-tl-[48px] shadow-2xl">
                                {children}
                                <Footer />
                            </main>
                        </div>
                    </Providers>
                </body>
            </html>
        </SessionProvider>
    );
};

export default CreatorLayout;
