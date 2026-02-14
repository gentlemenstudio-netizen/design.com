"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Loader2,
    Sparkles,
    CheckCircle,
    Zap,
    MousePointer2,
    Download,
    LayoutTemplate
} from "lucide-react";
import NProgress from "nprogress";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function LogoHomePage() {
    const [brand, setBrand] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();

    const handleGenerate = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!brand.trim()) return;

        NProgress.start();
        setIsGenerating(true);
        router.push(`/logos/templates?brand=${encodeURIComponent(brand)}`);
    };

    return (
        <div className="flex flex-col w-full bg-white selection:bg-indigo-100">
            {/* HERO SECTION */}
            <section className="relative bg-black text-white pt-24 pb-20 px-4 overflow-hidden">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full text-brand-light text-sm font-bold mb-8 border border-white/10">
                        <Sparkles className="size-4" />
                        Smart Design Platform
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
                        Identity Crafted <br className="hidden md:block" /> In Minutes.
                    </h1>

                    <p className="text-xl text-gray-400 mb-12 font-medium max-w-2xl mx-auto">
                        Create professional, high-quality logos with our intelligent design platform.
                        Customize fonts, colors, and layouts effortlessly—no experience required.
                    </p>

                    <form
                        onSubmit={handleGenerate}
                        className="flex flex-col sm:flex-row w-full max-w-2xl bg-white/95 p-2 rounded-3xl sm:rounded-2xl border border-white/10 shadow-2xl focus-within:border-brand-light transition-all mb-20 gap-2"
                    >
                        <input
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            placeholder="Enter brand name..."
                            className="flex-1 bg-transparent text-black px-6 py-4 text-base sm:text-lg focus:outline-none placeholder:text-gray-500 font-medium"
                        />
                        <button
                            type="submit"
                            disabled={isGenerating}
                            className="bg-brand-primary hover:bg-brand-light text-white font-bold px-6 py-4 sm:px-8 rounded-2xl sm:rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 h-[56px] sm:h-auto"
                        >
                            {isGenerating ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span className="whitespace-nowrap">Create your Logo</span>
                                    <ArrowRight className="size-5 shrink-0" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* COLLAGE SHOWCASE SECTION 
                            Note: I've used 'aspect-video' and 'aspect-square' to maintain the proportions 
                            seen in professional design collages.
                        */}
                    <div className="w-full max-w-7xl mx-auto px-4 mt-16 relative">
                        <div className="grid grid-cols-12 gap-4 md:grid-rows-2 md:h-[700px]">

                            {/* 1. Main Large Feature (Left) */}
                            <div className="col-span-12 md:col-span-7 md:row-span-2 bg-[#121212] rounded-[32px] md:rounded-[40px] border border-white/10 overflow-hidden relative group aspect-[4/3] md:aspect-auto">
                                <Image
                                    src="https://n11asj8ry1.ufs.sh/f/oTHHZ2dBnWVztvuVxn3ok60wBHIZYQW3N9Eg27seyti1PJSh"
                                    alt="Featured Brand Kit"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute bottom-8 left-8">
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
                                        Featured Brand Kit
                                    </p>
                                </div>
                            </div>

                            {/* 2. Top Right (Blue Print) */}
                            <div className="col-span-6 md:col-span-5 md:row-span-1 bg-[#1a1a1a] rounded-[24px] md:rounded-[40px] border border-white/10 overflow-hidden relative aspect-square md:aspect-auto">
                                <Image
                                    src="https://n11asj8ry1.ufs.sh/f/oTHHZ2dBnWVzzP3Tq3eZpPNJvhEcdTkMUfgouIOmrnQaSxVz"
                                    alt="Logo Blueprint"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* 3. Bottom Middle (Color Palette) */}
                            <div className="col-span-6 md:col-span-3 md:row-span-1 bg-[#1a1a1a] rounded-[24px] md:rounded-[40px] border border-white/10 overflow-hidden relative aspect-square md:aspect-auto">
                                <Image
                                    src="https://n11asj8ry1.ufs.sh/f/oTHHZ2dBnWVzr8W6lFIlsHpW4iO0SxCmYQueG9oqKAt1Zk3M"
                                    alt="Color Intelligence"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* 4. Bottom Right Accent (Master Files) */}
                            <div className="hidden md:block md:col-span-2 md:row-span-1 bg-brand-primary rounded-[40px] overflow-hidden relative group">
                                <Image
                                    src="https://n11asj8ry1.ufs.sh/f/oTHHZ2dBnWVzaaLypzR1hZijlDGrupocIbLV8TwgAyx95nO0"
                                    alt="Export Formats"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                        </div>

                        {/* Floating Success Indicator - Refined for Logomust colors */}
                        <div className="absolute -top-12 -right-4 hidden lg:block animate-bounce duration-[6000ms]">
                            <div className="bg-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(155,27,27,0.2)] rotate-12 border border-slate-100">
                                <div className="size-12 bg-red-50 rounded-xl flex items-center justify-center">
                                    <CheckCircle className="text-brand-primary size-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">How it works</h2>
                        <p className="text-slate-500 font-medium">Three simple steps to your new brand identity</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: MousePointer2, title: "1. Pick a Base", desc: "Enter your brand name and browse hundreds of custom-generated logo templates." },
                            { icon: LayoutTemplate, title: "2. Customize", desc: "Effortlessly change fonts, colors, and layouts with our intuitive editor." },
                            { icon: Download, title: "3. Launch", desc: "Download high-resolution SVG, PNG, and JPG files ready for any platform." }
                        ].map((step, i) => (
                            <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                                <div className="size-16 bg-brand-ultralight rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-light group-hover:text-white transition-colors">
                                    <step.icon className="size-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">{step.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES LISTING SECTION */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                                High-quality logos, <br /> No design skills needed.
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                Launching a startup or growing a small business? Our platform combines smart automation
                                with creative flexibility to design logos that look premium and unique.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Unlimited Logo Packs for every niche",
                                    "Professional Business Card Templates",
                                    "Premium Flyer & Social Media Designs",
                                    "High-Resolution Export in multiple formats"
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-3 font-bold text-slate-800">
                                        <div className="size-6 bg-brand-primary rounded-full flex items-center justify-center">
                                            <CheckCircle className="size-4 text-white" />
                                        </div>
                                        {item}
                                    </div>
                                ))}
                            </div>

                            <Button size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="rounded-2xl h-14 px-10 bg-black hover:bg-slate-800">
                                Start Your Design
                            </Button>
                        </div>

                        {/* Interactive Preview Mockup */}
                        <div className="relative bg-brand-ultralight rounded-[60px] p-12 aspect-square flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                            <div className="bg-white p-10 rounded-3xl shadow-2xl scale-110 relative z-10 rotate-3">
                                <Image src="/logo.svg" alt="Preview" width={150} height={150} />
                                <div className="mt-6 space-y-2">
                                    <div className="h-2 w-32 bg-slate-100 rounded-full" />
                                    <div className="h-2 w-20 bg-slate-100 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Reusable Button component for the page if not already in your UI folder
const Button = ({ children, className, onClick, size }: any) => (
    <button
        onClick={onClick}
        className={cn(
            "inline-flex items-center justify-center font-bold transition-all active:scale-95 text-white",
            size === "lg" ? "px-8 py-4 text-lg" : "px-4 py-2 text-sm",
            className
        )}
    >
        {children}
    </button>
);