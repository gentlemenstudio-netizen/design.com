"use client";

import { LOGO_LAYOUTS } from "@/features/editor/layouts/logo-layouts";
import { useEditor } from "@/features/editor/hooks/use-editor";
import { Editor } from "../types";

interface Props {
    editor: Editor | undefined;
    activeTool: string;
    onChangeActiveTool: (tool: any) => void;
}


export const LayoutSidebar = ({ editor, activeTool }: Props) => {

    if (!editor) return null;
    if (activeTool !== "layout" || !editor) return null;

    return (
        <div className="p-4 space-y-3">
            <h3 className="font-semibold">Edit Layout</h3>

            <div className="grid grid-cols-3 gap-3">
                {LOGO_LAYOUTS.map((layout) => (
                    <button
                        key={layout.id}
                        onClick={() => editor.applyLogoLayout(layout.id)}
                        className="rounded-md border bg-white p-3 hover:ring-2 hover:ring-primary"
                    >
                        <div className="h-12 w-full bg-gray-200 rounded" />
                        <p className="mt-2 text-xs text-center">{layout.label}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
