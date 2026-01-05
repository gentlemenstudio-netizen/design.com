import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { templates } from "@/db/schema";
import { auth } from "@/auth";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    await db.insert(templates).values({
        name: body.name,
        category: body.category,
        json: body.json,
        width: body.width,
        height: body.height,
        createdBy: session.user.id,
    });

    return NextResponse.json({ success: true });
}
