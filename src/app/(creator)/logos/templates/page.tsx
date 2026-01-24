export const dynamic = "force-dynamic";

import { db } from "@/db/drizzle";
import { templates } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { DesignTemplateClient } from "@/components/templates/design-template-client";
import { Search } from "lucide-react";

interface PageProps {
    searchParams: {
        brand?: string;
        tagline?: string;
        page?: string;
        admin?: string;
    };
}

export default async function LogoTemplatesPage({ searchParams }: PageProps) {
    const brand = searchParams.brand ?? "";
    const tagline = searchParams.tagline ?? "";
    const page = Number(searchParams.page ?? "1");
    const admin = searchParams.admin === "true";
    const limit = 40;
    const offset = (page - 1) * limit;

    const data = await db
        .select()
        .from(templates)
        .where(eq(templates.category, "logo"))
        .limit(limit)
        .offset(offset);

    const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(templates)
        .where(eq(templates.category, "logo"));

    const totalPages = Math.ceil(count / limit);

    return (
        <div className="flex flex-col min-h-screen bg-[#f9fafb]">
            {/* 1. Sub-Header: Search & Refine Section */}
            <header className="bg-black text-white py-8 px-6 lg:px-12 border-b border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">Your Logo Designs</h2>
                        <p className="text-sm text-gray-400">Showing templates for <span className="text-white font-medium">{brand || "Your Brand"}</span></p>
                    </div>

                    {/* Inline Refinement Bar */}
                    <form action="/logos/templates" className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center bg-white rounded-xl px-4 py-2 w-full sm:w-64 border border-transparent focus-within:border-indigo-500 transition-all">
                            <span className="text-[10px] font-bold text-gray-400 uppercase mr-3">Name</span>
                            <input
                                name="brand"
                                defaultValue={brand}
                                placeholder="Brand name"
                                className="bg-transparent text-black text-sm outline-none w-full font-medium"
                            />
                        </div>
                        <div className="flex items-center bg-white rounded-xl px-4 py-2 w-full sm:w-64 border border-transparent focus-within:border-indigo-500 transition-all">
                            <span className="text-[10px] font-bold text-gray-400 uppercase mr-3">Tagline</span>
                            <input
                                name="tagline"
                                defaultValue={tagline}
                                placeholder="Add a tagline"
                                className="bg-transparent text-black text-sm outline-none w-full font-medium"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-all active:scale-95 flex items-center justify-center"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </header>

            {/* 2. Main Content Area: The Template Grid */}
            <main className="p-6 lg:p-12 max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between mb-8">
                    <div className="text-sm text-gray-500 font-medium">
                        Found <span className="text-black">{count}</span> professional templates
                    </div>
                    {/* Filter placeholder for future use */}
                    <div className="flex gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                        Sort by: <span className="text-indigo-600 cursor-pointer">Popular</span>
                    </div>
                </div>

                <DesignTemplateClient
                    templates={data}
                    type="logos"
                    totalPages={totalPages}
                    page={page}
                    admin={admin}
                />
            </main>
        </div>
    );
}