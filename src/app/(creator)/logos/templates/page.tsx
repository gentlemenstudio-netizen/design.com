export const dynamic = "force-dynamic";

import { db } from "@/db/drizzle";
import { templates } from "@/db/schema";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { DesignTemplateClient } from "@/components/templates/design-template-client";
import { TemplatesHeader } from "@/components/templates/templates-header";

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
    const limit = 30;
    const offset = (page - 1) * limit;
    const firstLetter = brand.charAt(0).toLowerCase();    

    // Local states to manage loading and input values


    const data = await db
    .select()
    .from(templates)
    .where(eq(templates.category, "logo")) // We keep the category filter
    .orderBy(
        // Priority 1: Brand name matches the template name (Highest)
        desc(sql`CASE WHEN ${templates.name} ILIKE ${'%' + brand + '%'} THEN 2 ELSE 0 END`),
        
        // Priority 2: Brand name or first letter matches the tags
        desc(sql`CASE 
            WHEN ${brand} = ANY(${templates.tags}) THEN 1 
            WHEN ${firstLetter} = ANY(${templates.tags}) THEN 1
            ELSE 0 
        END`),
        
        // Priority 3: Show newest logos first among the remaining
        desc(templates.createdAt)
    )
    .limit(limit)
    .offset(offset);

// 3. Count remains the same for the total category
const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(templates)
    .where(eq(templates.category, "logo"));



    const totalPages = Math.ceil(count / limit);

    return (
        <div className="flex flex-col min-h-screen bg-[#f9fafb]">
            {/* 1. Sub-Header: Search & Refine Section */}
           <TemplatesHeader initialBrand={brand} initialTagline={tagline} />

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