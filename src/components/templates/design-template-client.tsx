"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react"; // 1. Import useSession

import { injectTemplateVariables } from "@/lib/inject-template";
import { TemplatePreview } from "@/components/templates/template-preview";
import { cn } from "@/lib/utils";

// 2. Import Dialog components (Assumes shadcn/ui or similar)
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { SignInCard } from "@/features/auth/components/sign-in-card"; // Adjust path as needed
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    totalPages: number;
    page: number;
    admin?: boolean;
}


export const DesignTemplateClient = ({ templates, type, totalPages, page, admin }: Props) => {
    const { data: session } = useSession(); // 3. Get session status
    const router = useRouter();
    const searchParams = useSearchParams();

    const [showAuthModal, setShowAuthModal] = useState(false); // 4. Modal state
    const [loadedCount, setLoadedCount] = useState<Set<string>>(new Set());

    // ... (Keep existing refs and pagination logic)

    const initialBrand = searchParams.get("brand") || "";
    const initialTagline = searchParams.get("tagline") || "";

    /** 🔁 Action handler with Auth Check */
    const handleTemplateClick = (template: DesignTemplate) => {
        if (!session) {
            setShowAuthModal(true); // 5. Show popup if not logged in
            return;
        }
        onUseTemplate(template); // Proceed if logged in
    };

    const onUseTemplate = async (template: DesignTemplate) => {
        // ... (Keep existing POST logic to /api/projects)
        const injectedJson = injectTemplateVariables(template.json, {
            BRAND_NAME: initialBrand.toUpperCase() || "LOGOTEXT",
            TAGLINE: initialTagline.toUpperCase() || "SLOGANHERE",
        });

        const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: `${initialBrand || "Brand"} Design`,
                json: JSON.stringify(injectedJson),
                width: template.width,
                height: template.height,
            }),
        });

        const result = await res.json();
        router.push(`/editor/${result.data.id}`);
    };

    /** 📄 Pagination handler */
    const goToPage = (p: number) => {
        // Create a new URLSearchParams object from the current search params
        const params = new URLSearchParams(searchParams.toString());

        // Update the 'page' parameter
        params.set("page", String(p));

        // Push the updated URL to the router to trigger a data fetch
        router.push(`?${params.toString()}`);
        router.refresh();
    };

    return (
        <div className="space-y-6">
            {/* 6. Auth Popup Modal */}
            <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
                <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
                    <SignInCard />
                </DialogContent>
            </Dialog>

            {/* templates grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {templates.map((template) => {
                    const previewJson = injectTemplateVariables(template.json, {
                        BRAND_NAME: initialBrand.toUpperCase() || "LOGOTEXT",
                        TAGLINE: initialTagline.toUpperCase() || "SLOGANHERE"
                    });

                    return (
                        <TemplatePreview
                            key={template.id}
                            json={previewJson}
                            admin={admin}
                            onClick={() => handleTemplateClick(template)} // 7. Use the new handler
                            onEdit={() => router.push(`/templates/edit/${template.id}`)}
                            onLoaded={() => {
                                setLoadedCount((prev) => {
                                    if (prev.has(template.id)) return prev;
                                    const next = new Set(prev);
                                    next.add(template.id);
                                    return next;
                                });
                            }}
                            onDelete={async () => {
                                if (!confirm("Delete this template?")) return;
                                await fetch(`/api/templates/${template.id}`, { method: "DELETE" });
                                router.refresh();
                            }}
                        />
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex flex-col items-center justify-center gap-y-4 pt-12 pb-8">
                    <div className="flex items-center gap-x-2">
                        {/* Previous Page Button */}
                        <button
                            disabled={page <= 1}
                            onClick={() => goToPage(page - 1)}
                            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-x-1">
                            {Array.from({ length: totalPages }).map((_, i) => {
                                const p = i + 1;
                                // For many pages, you could add logic here to show ellipses (...), 
                                // but for a standard count, this mapping works perfectly:
                                return (
                                    <button
                                        key={p}
                                        onClick={() => goToPage(p)}
                                        className={cn(
                                            "min-w-[40px] h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all",
                                            p === page
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                        )}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next Page Button */}
                        <button
                            disabled={page >= totalPages}
                            onClick={() => goToPage(page + 1)}
                            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            <ChevronRight className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>

                    {/* Page status text */}
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                        Page {page} of {totalPages}
                    </p>
                </div>
            )}
        </div>
    );
};