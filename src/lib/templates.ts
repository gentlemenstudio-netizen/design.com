import { db } from "@/db/drizzle";
import { templates } from "@/db/schema";
import { eq, desc } from "drizzle-orm";


export async function loadTemplates(type: "logo") {
    return await db
        .select()
        .from(templates)
        .where(eq(templates.category, "logo"))
        .orderBy(desc(templates.createdAt));
}
