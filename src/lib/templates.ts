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


export async function getTemplateById(id: string) {
    const data = await db
        .select()
        .from(templates)
        .where(eq(templates.id, id))
        .limit(1);
    return data[0] || null;
}
