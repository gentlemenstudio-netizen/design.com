import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { auth } from "@/auth";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const [project] = await db
        .insert(projects)
        .values({
            name: body.name,
            json: body.json,
            width: body.width,
            height: body.height,
            userId: session.user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .returning();



    return NextResponse.json(project);
}
