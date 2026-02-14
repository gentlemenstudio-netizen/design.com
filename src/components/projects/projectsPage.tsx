"use client";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { TemplatePreview } from "../templates/template-preview";
import { ProjectPreview } from "./project-preview";

const TABS = [
    { label: "Saved Logos", value: "logos", href: "/saved-logos" },
    { label: "Business Cards (Soon)", value: "business-cards", href: "#" },
    { label: "Flyers (Soon)", value: "flyers", href: "#" },
];

export default function ProjectsPage() {
    const pathname = usePathname();
    const router = useRouter();

    // Using your custom hook to fetch projects from the API
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useGetProjects();

    // Flattening the infinite query pages into a single array
    const projects = data?.pages.flatMap((page) => page.data) || [];

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="bg-black text-white py-14 text-center">
                <h1 className="text-4xl font-bold">Draft Designs</h1>
                <p className="text-slate-400 mt-2">Pick up where you left off</p>
            </div>

            <div className="max-w-7xl mx-auto py-8 px-6">
                {/* Tab Navigation with Separate Links */}
                <div className="flex items-center space-x-1 border-b mb-8">
                    {TABS.map((tab) => (
                        <Link
                            key={tab.value}
                            href={tab.href}
                            className={cn(
                                "px-6 py-3 text-sm font-semibold transition-all relative",
                                pathname === tab.href
                                    ? "text-brand-primary border-b-2 border-brand-primary"
                                    : "text-slate-500 hover:text-slate-800"
                            )}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        <p className="text-slate-500 mt-4 font-medium">Loading your designs...</p>
                    </div>
                )}

                {!isLoading && projects.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-slate-500 mt-4 font-medium">No saved designs found. Start creating your first design!</p>
                        <Button
                            onClick={() => router.push("/")}
                            className="mt-6 bg-brand-primary hover:bg-brand-light text-white"
                        >
                            Create New Logo
                        </Button>
                    </div>
                )}


                {/* Project Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {projects.map((project: any) => {
                        // CRITICAL FIX: Parse the JSON if it's arriving as a string
                        const parsedJson = typeof project.json === "string"
                            ? JSON.parse(project.json)
                            : project.json;

                        return (
                            <div key={project.id} className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all">
                                <div className="aspect-[1.24/1] relative bg-slate-50">
                                    <TemplatePreview
                                        json={parsedJson} // Pass parsed object here
                                        admin={false}
                                        onEdit={() => router.push(`/editor/${project.id}`)}
                                        onDelete={() => console.log("Delete design")}
                                    />
                                </div>
                                <div className="p-4 border-t">
                                    <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest truncate mb-4">
                                        {project.name || "Untitled Design"}
                                    </h3>
                                    <Button
                                        onClick={() => router.push(`/editor/${project.id}`)}
                                        className="w-full bg-brand-primary hover:bg-brand-light text-white text-xs font-bold h-9"
                                    >
                                        Customize
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Load More Button for Infinite Scrolling */}
                {hasNextPage && (
                    <div className="mt-12 text-center">
                        <Button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            variant="ghost"
                            className="text-brand-primary font-bold"
                        >
                            {isFetchingNextPage ? "Loading more..." : "Show more designs"}
                        </Button>
                    </div>
                )}
            </div>
        </div >
    );
}