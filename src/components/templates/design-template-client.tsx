"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { injectTemplateVariables } from "@/lib/inject-template";
import { TemplatePreview } from "@/components/templates/template-preview";
import { cn } from "@/lib/utils";

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
    type?: string;
    total: number;
    page: number;
}

const PAGE_SIZE = 40;

export const DesignTemplateClient = ({ templates, type, total, page }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();


    // 🔹 Initial values from URL
    const initialBrand = searchParams.get("brand") || "";
    const initialTagline = searchParams.get("tagline") || "";

    const [loadedCount, setLoadedCount] = useState(0);

    const totalPages = Math.ceil(total / PAGE_SIZE);
    const isLoading = loadedCount < templates.length;


    // 🔹 Input state (editable)
    const [brandInput, setBrandInput] = useState(initialBrand);
    const [taglineInput, setTaglineInput] = useState(initialTagline);

    // 🔹 Applied values (used for rendering)
    const [appliedBrand, setAppliedBrand] = useState(initialBrand);
    const [appliedTagline, setAppliedTagline] = useState(initialTagline);

    /** 🔁 Reset loading when templates change (search / pagination) */
    useEffect(() => {
        setLoadedCount(0);
    }, [templates]);

    console.log({ total });


    const onApply = () => {
        setAppliedBrand(brandInput);
        setAppliedTagline(taglineInput);

        const params = new URLSearchParams();
        if (brandInput) params.set("brand", brandInput);
        if (taglineInput) params.set("tagline", taglineInput);
        params.set("page", "1");

        router.push(`?${params.toString()}`);
    };


    /** 📄 Pagination handler */
    const goToPage = (p: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(p));
        router.push(`?${params.toString()}`);
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
                name: `${appliedBrand || "Brand"} Design`,
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

            {/* 🔄 Global Loader */}
            {isLoading && (
                <div className="fixed inset-0 z-50 bg-white/70 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
                </div>
            )}


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
                            onEdit={() => router.push(`/templates/edit/${template.id}`)}
                            onLoaded={() =>
                                setLoadedCount((count) => count + 1)
                            }
                            onDelete={async () => {
                                if (!confirm("Delete this template?")) return;

                                await fetch(`/api/templates/${template.id}`, {
                                    method: "DELETE",
                                });

                                router.refresh();
                            }}
                        />
                    );
                })}
            </div>

            {/* 📄 Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-6">
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const p = i + 1;
                        return (
                            <button
                                key={p}
                                onClick={() => goToPage(p)}
                                className={cn(
                                    "px-3 py-1 rounded border",
                                    p === page
                                        ? "bg-black text-white"
                                        : "hover:bg-gray-100"
                                )}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
