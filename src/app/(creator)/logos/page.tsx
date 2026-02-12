"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Sparkles, CheckCircle, Palette, Layers, Zap } from "lucide-react";
import NProgress from "nprogress";
import Image from "next/image";

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
        <div className="flex flex-col w-full bg-white">
            {/* HERO SECTION: Dark & Premium */}
            <section className="bg-black text-white pt-24 pb-20 px-4 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-indigo-400 text-sm font-bold mb-8 border border-white/10 animate-fade-in">
                    <Sparkles className="size-4" />
                    AI-Powered Design Intelligence
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 max-w-5xl leading-[0.9]">
                    Identity <br className="hidden md:block" /> Crafted in Minutes.
                </h1>
                
                <p className="text-xl text-gray-400 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
                    Create professional, high-quality logos with our intelligent design platform. 
                    Customize fonts, colors, and layouts effortlessly—no design experience required.
                </p>

                <form 
                    onSubmit={handleGenerate}
                    className="flex w-full max-w-2xl bg-[#1a1a1a] p-2 rounded-2xl border border-white/10 shadow-2xl focus-within:border-indigo-500 transition-all mb-12"
                >
                    <input
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="Enter your brand name..."
                        className="flex-1 bg-transparent text-white px-6 py-4 text-lg focus:outline-none placeholder:text-gray-600 font-medium"
                    />
                    <button
                        type="submit"
                        disabled={isGenerating}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-70 flex items-center gap-2"
                    >
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Designing"}
                        {!isGenerating && <ArrowRight className="size-5" />}
                    </button>
                </form>

                {/* THE COLLAGE SHOWCASE: Visual Grid */}
                <div className="w-full max-w-6xl mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 px-4 opacity-80">
                    <div className="h-48 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
                        <Image src="/logo.svg" alt="Logo Sample" width={80} height={80} className="opacity-50" />
                    </div>
                    <div className="h-48 bg-indigo-600/20 rounded-3xl border border-indigo-500/20 flex items-center justify-center translate-y-8">
                        <Palette className="size-12 text-indigo-400" />
                    </div>
                    <div className="h-48 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
                         <Layers className="size-12 text-slate-500" />
                    </div>
                    <div className="h-48 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center translate-y-8">
                         <Zap className="size-12 text-amber-400" />
                    </div>
                </div>
            </section>

            {/* VALUE PROPOSITION SECTION: Light & Clean */}
            <section className="py-32 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                                Design logos that look premium and unique.
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                Whether you&apos;re launching a startup, growing a small business, or rebranding, 
                                our powerful tools help you craft a logo that truly represents your brand identity. 
                                With smart automation and creative flexibility combined, you get results that stand out.
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                {[
                                    "Unlimited Logo Packs",
                                    "Business Card Templates",
                                    "Premium Flyer Designs",
                                    "High-Res Export (SVG/PNG)"
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-3 font-bold text-slate-800">
                                        <CheckCircle className="size-5 text-indigo-600" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual Asset / Mockup Area */}
                        <div className="relative bg-slate-50 rounded-[40px] p-8 aspect-square flex items-center justify-center overflow-hidden border border-slate-100">
                             <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent" />
                             <div className="relative z-10 w-full grid grid-cols-2 gap-4">
                                <div className="aspect-square bg-white rounded-2xl shadow-xl shadow-indigo-100 p-6 flex items-center justify-center animate-bounce duration-[3000ms]">
                                    <Image src="/logo.svg" alt="Preview" width={100} height={100} />
                                </div>
                                <div className="aspect-square bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 p-6 flex items-center justify-center translate-y-12">
                                    <span className="text-white font-black text-4xl">G</span>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}