"use client";

import { Editor } from "../types";
import { LayoutPreview } from "../layout/LayoutPreview";
import clsx from "clsx";
import { LOGO_LAYOUT_RECIPES } from "../layout/logo-layout.recipes";
import { LogoLayoutId } from "../layout/logo-layout.types";


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
                {Object.keys(LOGO_LAYOUT_RECIPES).map((id) => (
                    <button
                        key={id}
                        onClick={() => editor.applyLogoLayout(id as LogoLayoutId)}
                        className={clsx(
                            "rounded-md border bg-white p-3 hover:border-blue-500 transition",
                            "flex items-center justify-center"
                        )}
                    >
                        <LayoutPreview layoutId={id as LogoLayoutId} />
                    </button>
                ))}
            </div>
        </div>
    );
}
