"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LogoHomePage() {
    const [brand, setBrand] = useState("");
    const router = useRouter();

    const handleGenerate = () => {
        if (!brand.trim()) return;
        router.push(`/logos/templates?brand=${encodeURIComponent(brand)}`);
        router.refresh();
    };

    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section className="bg-black text-white pt-24 pb-32 px-4 flex flex-col items-center text-center">
                <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4 max-w-4xl leading-[1.1]">
                    Design & Branding <br /> Made Easy
                </h1>
                <p className="text-xl text-gray-400 mb-10 font-medium">
                    Launch and grow your dream business
                </p>

                <div className="flex w-full max-w-2xl bg-[#1a1a1a] p-2 rounded-2xl border border-white/10 shadow-2xl">
                    <input
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="Enter your brand name"
                        className="flex-1 bg-transparent text-white px-6 py-4 text-lg focus:outline-none placeholder:text-gray-600"
                    />
                    <button
                        onClick={handleGenerate}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg active:scale-95"
                    >
                        Create Logos
                    </button>
                </div>
            </section>

            {/* Modern Logo-Only Showcase Section */}
            <section className="bg-white -mt-10 rounded-t-[48px] py-24 px-8 border-t relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-[0.2em]">
                                <Sparkles className="w-4 h-4" />
                                <span>Logo Templates</span>
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Explore Professional Styles</h2>
                        </div>
                        <button
                            onClick={() => router.push('/logos')}
                            className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors group"
                        >
                            View all templates <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Staggered Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[220px]">

                        {/* 1. Large Featured Minimal Logo (Takes up 2x2 area) */}
                        <div className="md:col-span-2 md:row-span-2 bg-[#f8faff] rounded-[40px] border border-blue-50 p-12 flex flex-col items-center justify-center group cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
                            <div className="w-44 h-44 bg-white rounded-full shadow-sm border flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                <div className="w-20 h-20 border-4 border-indigo-600 rounded-lg rotate-45 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-indigo-600 rounded-sm -rotate-45" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">AVID VENTURES</h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Modern Minimal</p>
                        </div>

                        {/* 2. Dark Luxury Wordmark (Wide) */}
                        <div className="md:col-span-2 bg-[#111] rounded-[40px] p-8 flex flex-col items-center justify-center group cursor-pointer overflow-hidden relative border border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative text-center">
                                <span className="text-5xl font-serif italic text-white font-light border-b border-white/20 pb-2 px-6">Gentlemen</span>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-6">Luxury Branding</p>
                            </div>
                        </div>

                        {/* 3. Tech/SaaS Style (Tall) */}
                        <div className="md:col-span-1 md:row-span-1 bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 flex flex-col items-center justify-center group cursor-pointer hover:border-indigo-200 transition-all">
                            <div className="flex gap-1.5 mb-6">
                                <div className="w-3.5 h-10 bg-slate-900 rounded-full group-hover:bg-indigo-600 transition-colors" />
                                <div className="w-3.5 h-14 bg-indigo-600 rounded-full" />
                                <div className="w-3.5 h-10 bg-slate-900 rounded-full group-hover:bg-indigo-600 transition-colors" />
                            </div>
                            <p className="font-black text-slate-900 text-xs uppercase tracking-widest">Tech Flow</p>
                        </div>

                        {/* 4. Playful/Vibrant Style */}
                        <div className="md:col-span-1 bg-[#fff8f1] rounded-[40px] border border-orange-100 p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:scale-[1.02] transition-transform">
                            <div className="w-20 h-20 bg-orange-500 rounded-[24px] mb-4 shadow-xl shadow-orange-200 flex items-center justify-center text-white text-3xl font-bold">S</div>
                            <p className="font-bold text-orange-900 text-xs tracking-widest uppercase">Creative</p>
                        </div>

                        {/* 5. Classic Badge Style (Wide Bottom) */}
                        <div className="md:col-span-2 bg-slate-50 rounded-[40px] p-10 flex items-center gap-10 group cursor-pointer overflow-hidden border border-slate-100">
                            <div className="w-28 h-28 border-[3px] border-slate-300 rounded-full flex items-center justify-center border-dashed group-hover:rotate-12 transition-transform duration-700">
                                <div className="w-20 h-20 bg-white shadow-inner rounded-full flex items-center justify-center font-black text-slate-300 text-2xl">EST</div>
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-black text-slate-900 text-xl tracking-tight">Vintage Badges</h4>
                                <p className="text-slate-500 text-sm font-medium">Timeless emblem designs for established businesses.</p>
                            </div>
                        </div>


                        <div className="md:col-span-2 bg-slate-50 rounded-[40px] p-10 flex items-center gap-10 group cursor-pointer overflow-hidden border border-slate-100">
                            <div className="w-28 h-28 border-[3px] border-slate-300 rounded-full flex items-center justify-center border-dashed group-hover:rotate-12 transition-transform duration-700">
                                <div className="w-20 h-20 bg-white shadow-inner rounded-full flex items-center justify-center font-black text-slate-300 text-2xl">EST</div>
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-black text-slate-900 text-xl tracking-tight">Vintage Badges</h4>
                                <p className="text-slate-500 text-sm font-medium">Timeless emblem designs for established businesses.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}