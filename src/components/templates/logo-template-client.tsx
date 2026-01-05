"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { injectTemplateVariables } from "@/lib/inject-template";
import { TemplatePreview } from "@/components/templates/template-preview";

/**
 * Strongly typed template structure
 */
interface LogoTemplate {
    id: string;
    name: string;
    category: string;
    json: any;
    width: number;
    height: number;
}

interface LogoTemplateClientProps {
    templates: LogoTemplate[];
}

export const LogoTemplateClient = ({
    templates,
}: LogoTemplateClientProps) => {
    const [brand, setBrand] = useState("");
    const router = useRouter();
    const onUseTemplate = async (template: LogoTemplate) => {
        const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: template.name,
                json: JSON.stringify({
                    width: template.width,
                    height: template.height,
                    ...template.json,
                }),
                width: 900,
                height: 900,
            }),
        });

        const result = await res.json();

        if (!result?.data?.id) {
            alert("Failed to create project");
            return;
        }

        router.push(`/editor/${result.data.id}`);
    };

    return (
        <div className="space-y-6">
            {/* Brand input */}
            <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Enter your brand name"
                className="border rounded px-4 py-2 w-full max-w-sm"
            />

            {/* Templates grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {templates.map((template) => {
                    const injectedJson = injectTemplateVariables(
                        template.json,
                        { BRAND_NAME: brand || "Your Brand" }
                    );

                    return (
                        <TemplatePreview
                            key={template.id}
                            json={injectedJson}
                            onClick={() => onUseTemplate(template)}
                        />
                    );
                })}
            </div>
        </div>
    );
};
