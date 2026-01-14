import { Metadata } from "next/types";
import { Navbar } from "../(dashboard)/navbar";
import { Sidebar } from "../(dashboard)/sidebar";
import {
    Inter,
    Poppins,
    Montserrat,
    Playfair_Display,
    Raleway,
    Bebas_Neue,
    Oswald,
} from "next/font/google";
import { Providers } from "@/components/providers";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { FONT_VARIABLES } from "@/lib/brand-fonts";



export const metadata: Metadata = {
    title: "Gentlemen Designs",
    description: "Build Something Great!",
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
                        <div className="bg-muted h-full">
                            <Sidebar />
                            <div className="lg:pl-[300px] flex flex-col h-full">
                                <Navbar />
                                <main className="bg-white flex-1 overflow-auto p-8 lg:rounded-tl-2xl">
                                    {children}
                                </main>
                            </div>
                        </div>
                    </Providers>
                </body>
            </html>
        </SessionProvider>
    );
};

export default CreatorLayout;
