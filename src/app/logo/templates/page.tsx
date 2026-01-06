import { db } from "@/db/drizzle";
import { templates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LogoTemplateClient } from "@/components/templates/logo-template-client";

export default async function LogoTemplatesPage() {
    const data = await db
        .select()
        .from(templates)
        .where(eq(templates.category, "logo"));

    return (
        <div className="p-6 space-y-6">
            <LogoTemplateClient templates={data} />
        </div>
    );
}
