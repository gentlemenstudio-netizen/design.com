import { db } from "@/db/drizzle";
import { templates } from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase();

    if (!query || query.length < 3) {
        return NextResponse.json([]);
    }

    try {
        // This query unnest the tags array, filters by the search term, 
        // and returns unique (distinct) results.
        const results = await db.execute(sql`
            SELECT DISTINCT unnested_tag 
            FROM ${templates}, 
            unnest(${templates.tags}) AS unnested_tag 
            WHERE unnested_tag ILIKE ${query + '%'}
            LIMIT 10
        `);

        // Extract values from rows
        const suggestions = results.rows.map((row: any) => row.unnested_tag);

        return NextResponse.json(suggestions);
    } catch (error) {
        console.error("Tag search error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}