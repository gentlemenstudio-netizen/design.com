"use client";

import {
    Search,
    MessageCircle,
    BookOpen,
    Settings,
    ShieldCheck,
    CreditCard,
    Download,
    ArrowUpRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const categories = [
    {
        icon: Download,
        title: "Downloads & Files",
        desc: "How to access your SVG, PNG, and high-res vector files.",
        links: ["Exporting for Print", "Transparent Backgrounds", "File Formats Guide"]
    },
    {
        icon: CreditCard,
        title: "Billing & Subscription",
        desc: "Manage your Pro plan, invoices, and payment methods.",
        links: ["Updating Card Info", "Refund Policy", "Cancel Subscription"]
    },
    {
        icon: Settings,
        title: "Editor Tools",
        desc: "Master the canvas to create the perfect brand identity.",
        links: ["Changing Fonts", "Color Palette Tips", "Icon Alignment"]
    },
    {
        icon: ShieldCheck,
        title: "Copyright & Usage",
        desc: "Understanding your commercial rights and trademarks.",
        links: ["Commercial Licensing", "Trademarking Logos", "Usage Restrictions"]
    }
];

export default function HelpCenter() {
    return (
        <div className="bg-black min-h-screen text-white pb-20">
            {/* Header / Search Section */}
            <div className="relative pt-24 pb-32 px-4 border-b border-white/5 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent">
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
                        How can we help?
                    </h1>
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            placeholder="Search for articles (e.g. 'how to download SVG')..."
                            className="w-full bg-white/5 border border-white/10 h-16 rounded-2xl pl-16 pr-6 text-lg focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-gray-600"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
                <div className="grid md:grid-cols-2 gap-6">
                    {categories.map((cat) => (
                        <div
                            key={cat.title}
                            className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[32px] hover:border-brand-primary/20 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="size-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                                    <cat.icon className="text-brand-primary size-7" />
                                </div>
                                <ArrowUpRight className="text-gray-700 group-hover:text-brand-primary transition-colors" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{cat.title}</h3>
                            <p className="text-gray-500 mb-6 font-medium leading-relaxed">{cat.desc}</p>

                            <ul className="space-y-3">
                                {cat.links.map((link) => (
                                    <li key={link}>
                                        <button className="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                            <div className="size-1.5 bg-brand-primary rounded-full" />
                                            {link}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Support CTA */}
                <div className="mt-20 bg-brand-primary rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Still need assistance?</h2>
                        <p className="text-white/80 font-medium mb-8 max-w-lg mx-auto">
                            Our design experts are available 24/7 to help you with your branding journey.
                        </p>
                        <button className="bg-white text-black px-10 py-4 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all active:scale-95 flex items-center gap-2 mx-auto">
                            <MessageCircle className="size-5" />
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}