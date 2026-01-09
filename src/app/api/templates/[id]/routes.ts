import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { templates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    _: Request,
    { params }: { params: { id: string } }
) {
    const data = await db
        .select()
        .from(templates)
        .where(eq(templates.id, params.id))
        .limit(1);

    if (!data[0]) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ data: data[0] });
}
