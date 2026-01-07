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


interface CreatorLayoutProps {
    children: React.ReactNode;
}

const CreatorLayout = async ({ children }: CreatorLayoutProps) => {
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
