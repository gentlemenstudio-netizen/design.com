"use client";

import { useEffect, useRef, useState } from "react";
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
    admin?: boolean;
}

const PAGE_SIZE = 40;

export const DesignTemplateClient = ({ templates, type, total, page, admin }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const brandRef = useRef<HTMLInputElement>(null);
    const taglineRef = useRef<HTMLInputElement>(null);


    // 🔹 Initial values from URL
    const initialBrand = searchParams.get("brand") || "";
    const initialTagline = searchParams.get("tagline") || "";

    const [loadedCount, setLoadedCount] = useState<Set<string>>(new Set());

    const totalPages = Math.ceil(total / PAGE_SIZE);
    const isLoading = loadedCount.size < templates.length;
    const [manualLoading, setManualLoading] = useState(false);


    // 🔹 Input state (editable)
    const [brandInput, setBrandInput] = useState(initialBrand);
    const [taglineInput, setTaglineInput] = useState(initialTagline);

    // 🔹 Applied values (used for rendering)
    const [appliedBrand, setAppliedBrand] = useState(initialBrand);
    const [appliedTagline, setAppliedTagline] = useState(initialTagline);

    /** 🔁 Reset loading when templates change (search / pagination) */
    useEffect(() => {
        setLoadedCount(() => new Set());
    }, [templates]);

    useEffect(() => {
        const brand = searchParams.get("brand") || "";
        const tagline = searchParams.get("tagline") || "";

        setAppliedBrand(brand);
        setAppliedTagline(tagline);
    }, [searchParams]);


    const onApply = () => {
        setManualLoading(true);
        const brandName = brandRef.current?.value || "";
        const tagLine = taglineRef.current?.value || "";
        const params = new URLSearchParams();
        if (brandName) params.set("brand", brandName);
        if (tagLine) params.set("tagline", tagLine);
        params.set("page", "1");


        router.push(`/logos/templates?${params.toString()}`);
        router.refresh();
        setManualLoading(false);
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
            {(isLoading || manualLoading) && (
                <div className="fixed inset-0 z-50 bg-white/70 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
                </div>
            )}


            <div className="flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm mb-1">Brand name</label>
                    <input
                        ref={brandRef}
                        defaultValue={brandInput}
                        className="border rounded px-3 py-2 w-64"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Tagline</label>
                    <input
                        ref={taglineRef}
                        defaultValue={taglineInput}
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
                            admin={admin}
                            onClick={() => onUseTemplate(template)}
                            onEdit={() => router.push(`/templates/edit/${template.id}`)}
                            onLoaded={() => {
                                setLoadedCount((prev) => {
                                    if (prev.has(template.id)) return prev; // 🔒 guard
                                    const next = new Set(prev);
                                    next.add(template.id);
                                    return next;
                                });
                            }}
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
