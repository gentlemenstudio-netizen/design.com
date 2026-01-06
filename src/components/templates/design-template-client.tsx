"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { injectTemplateVariables } from "@/lib/inject-template";
import { TemplatePreview } from "@/components/templates/template-preview";

interface DesignTemplate {
    id: string;
    name: string;
    category: string;
    json: any;
    width: number;
    height: number;
}

interface Props {
    templates: DesignTemplate[];
}

export const DesignTemplateClient = ({ templates }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // 🔹 Initial values from URL
    const initialBrand = searchParams.get("brand") || "";
    const initialTagline = searchParams.get("tagline") || "";

    // 🔹 Input state (editable)
    const [brandInput, setBrandInput] = useState(initialBrand);
    const [taglineInput, setTaglineInput] = useState(initialTagline);

    // 🔹 Applied values (used for rendering)
    const [appliedBrand, setAppliedBrand] = useState(initialBrand);
    const [appliedTagline, setAppliedTagline] = useState(initialTagline);

    const onApply = () => {
        setAppliedBrand(brandInput);
        setAppliedTagline(taglineInput);

        router.replace(
            `/logos/templates?brand=${encodeURIComponent(
                brandInput
            )}&tagline=${encodeURIComponent(taglineInput)}`
        );
    };

    const onUseTemplate = async (template: DesignTemplate) => {
        const injectedJson = injectTemplateVariables(template.json, {
            BRAND_NAME: appliedBrand || "Your Brand",
            TAGLINE: appliedTagline || "",
        });

        const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: `${appliedBrand || "Brand"} Logo`,
                json: JSON.stringify({
                    ...injectedJson,
                }),
                width: template.width,
                height: template.height,
            }),
        });

        const result = await res.json();
        router.push(`/editor/${result.data.id}`);
    };

    return (
        <div className="space-y-6">
            {/* 🔹 Header inputs */}
            <div className="flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm mb-1">Brand name</label>
                    <input
                        value={brandInput}
                        onChange={(e) => setBrandInput(e.target.value)}
                        className="border rounded px-3 py-2 w-64"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Tagline</label>
                    <input
                        value={taglineInput}
                        onChange={(e) => setTaglineInput(e.target.value)}
                        className="border rounded px-3 py-2 w-64"
                    />
                </div>

                <button
                    onClick={onApply}
                    className="bg-black text-white px-5 py-2 rounded"
                >
                    Search
                </button>
            </div>

            {/* 🔹 Templates grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {templates.map((template) => {
                    const previewJson = injectTemplateVariables(template.json, {
                        BRAND_NAME: appliedBrand || "Your Brand",
                        TAGLINE: appliedTagline || "",
                    });

                    return (
                        <TemplatePreview
                            key={template.id}
                            json={previewJson}
                            onClick={() => onUseTemplate(template)}
                        />
                    );
                })}
            </div>
        </div>
    );
};
