export const dynamic = "force-dynamic";

import { db } from "@/db/drizzle";
import { templates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DesignTemplateClient } from "@/components/templates/design-template-client";

export default async function LogoTemplatesPage() {
    const data = await db
        .select()
        .from(templates)
        .where(eq(templates.category, "logo"));

    return (
        <div className="p-6 space-y-6">
            <DesignTemplateClient templates={data} />
        </div>
    );
}
