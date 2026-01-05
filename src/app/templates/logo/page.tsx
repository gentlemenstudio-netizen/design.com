import { LogoTemplateClient } from "@/components/templates/logo-template-client";
import { loadTemplates } from "@/lib/templates";

export default async function LogoTemplatesPage() {
    const templates = await loadTemplates("logo");

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Choose a Logo Template</h1>

            {/* Pass templates to client component */}
            <LogoTemplateClient templates={templates} />
        </div>
    );
}
