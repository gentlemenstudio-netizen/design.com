"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import NProgress from "nprogress";

interface TemplatesHeaderProps {
    initialBrand: string;
    initialTagline: string;
}

export const TemplatesHeader = ({ initialBrand, initialTagline }: TemplatesHeaderProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [isSearching, setIsSearching] = useState(false);
    const [brand, setBrand] = useState(initialBrand);
    const [tagline, setTagline] = useState(initialTagline);

    // --- NEW: Reset loading state when the URL changes ---
    useEffect(() => {
        setIsSearching(false);
        NProgress.done();
    }, [searchParams]); // Fires whenever the brand/tagline/page in URL changes

    const handleRefine = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Prevent double clicks
        if (isSearching) return;

        setIsSearching(true);
        NProgress.start();

        const params = new URLSearchParams(searchParams.toString());
        params.set("brand", brand);
        params.set("tagline", tagline);
        params.set("page", "1");

        router.push(`?${params.toString()}`);
    };

    return (
        <header className="bg-black text-white py-8 px-6 lg:px-12 border-b border-white/10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Your Logo Designs</h2>
                    <p className="text-sm text-gray-400">
                        Showing templates for <span className="text-white font-medium">{brand || "Your Brand"}</span>
                    </p>
                </div>

                <form onSubmit={handleRefine} className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center bg-white rounded-xl px-4 py-2 w-full sm:w-64 border border-transparent focus-within:border-indigo-500 transition-all">
                        <span className="text-[10px] font-bold text-gray-400 uppercase mr-3">Name</span>
                        <input
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            placeholder="Brand name"
                            className="bg-transparent text-black text-sm outline-none w-full font-medium"
                        />
                    </div>
                    <div className="flex items-center bg-white rounded-xl px-4 py-2 w-full sm:w-64 border border-transparent focus-within:border-indigo-500 transition-all">
                        <span className="text-[10px] font-bold text-gray-400 uppercase mr-3">Tagline</span>
                        <input
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            placeholder="Add a tagline"
                            className="bg-transparent text-black text-sm outline-none w-full font-medium"
                        />
                    </div>
                  <button
                type="submit"
                disabled={isSearching}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-all active:scale-95 flex items-center justify-center disabled:opacity-70 min-w-[44px]"
            >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
                </form>
            </div>
        </header>
    );
};