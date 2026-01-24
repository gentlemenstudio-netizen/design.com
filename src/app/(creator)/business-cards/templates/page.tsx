export const dynamic = "force-dynamic";

import { db } from "@/db/drizzle";
import { templates } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { DesignTemplateClient } from "@/components/templates/design-template-client";


interface PageProps {
    searchParams: {
        brand?: string;
        tagline?: string;
        page?: string;
    };
}


export default async function LogoTemplatesPage({ searchParams }: PageProps) {

    const brand = searchParams.brand ?? "";
    const tagline = searchParams.tagline ?? "";
    const page = Number(searchParams.page ?? "1");
    const limit = 40;
    const offset = (page - 1) * limit;

    const data = await db
        .select()
        .from(templates)
        .where(eq(templates.category, "business-card"))
        .limit(limit)
        .offset(offset);

    const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(templates)
        .where(eq(templates.category, "business-card"));

    const totalPages = Math.ceil(count / limit);

    return (
        <div className="p-6 space-y-6">
            <DesignTemplateClient templates={data} type="business-card" totalPages={count} page={page} />
        </div>
    );
}
