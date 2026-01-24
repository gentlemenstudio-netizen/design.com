import { UserButton } from "@/features/auth/components/user-button"
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Space_Grotesk } from "next/font/google";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/app/(dashboard)/logo";

const font = Space_Grotesk({
  weight: ["700"],
  subsets: ["latin"],
});

export const Navbar = () => {
  return (
    // Inside your Navbar component
    <nav className="w-full flex items-center px-8 h-[68px] bg-black text-white border-b border-white/10">
      <div className="flex items-center gap-x-12 w-full">
        {/* Logo Section */}
        <Logo />

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-x-8">
          <Link href="/logos" className="flex items-center gap-x-1 hover:text-indigo-400 transition font-medium text-[15px]">
            Logos <ChevronDown className="w-4 h-4 opacity-50" />
          </Link>
          <Link href="/business-cards" className="flex items-center gap-x-1 hover:text-indigo-400 transition font-medium text-[15px]">
            Business Cards <ChevronDown className="w-4 h-4 opacity-50" />
          </Link>
          <div className="flex items-center gap-x-2 text-gray-500 cursor-not-allowed">
            <span className="text-[15px] font-medium">Flyers</span>
            <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Soon</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-x-4">
          <UserButton />
        </div>
      </div>
    </nav>

  );
};
