"use client";

import { useEditor } from "@/features/editor/hooks/use-editor";
import { Editor } from "../types";
import { LOGO_LAYOUT_ITEMS } from "../layout/logo-layout.registry";
import { LayoutPreview } from "../layout/LayoutPreview";
import clsx from "clsx";


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

            <div className="grid grid-cols-3 gap-3 p-4">
                {LOGO_LAYOUT_ITEMS.map((layout) => (
                    <button
                        key={layout.id}
                        onClick={() => editor.applyLogoLayout(layout.id)}
                        className={clsx(
                            "rounded-md border bg-white p-3 hover:border-blue-500 transition",
                            "flex items-center justify-center"
                        )}
                    >
                        <LayoutPreview type={layout.preview} />
                    </button>
                ))}
            </div>
        </div>
    );
}
