"use client";

import { useEffect, useState } from "react";
import { Editor } from "@/features/editor/types";
import { PopoverContent, PopoverTrigger, Popover } from "./popover";
import { ColorPicker } from "./color-picker2";

interface Props {
    editor: Editor | undefined;
    activeTool: string;
    onChangeActiveTool: (tool: any) => void;
}


export const IconColorSidebar = ({ editor, activeTool }: Props) => {
    const [colors, setColors] = useState<string[]>([]);

    useEffect(() => {
        if (!editor) return;
        setColors(editor.getIconColors());
    }, [editor]);

    if (activeTool !== "iconColor" || !editor) return null;

    return (
        <aside className="w-72 bg-background border-r p-4 space-y-6">
            <h3 className="text-sm font-semibold">Icon colors</h3>

            {/* Color swatches */}
            <div className="flex flex-wrap gap-3">
                {colors.map((color, index) => (
                    <Popover key={`${color}-${index}`}>
                        <PopoverTrigger asChild>
                            <button
                                className="w-10 h-10 rounded-full border shadow-sm"
                                style={{ backgroundColor: color }}
                            />
                        </PopoverTrigger>

                        <PopoverContent side="right" align="center" className="p-2">
                            <ColorPicker
                                color={color}
                                onChange={(newColor) => {
                                    editor.replaceIconColor(color, newColor);
                                    setColors(
                                        colors.map(c => (c === color ? newColor : c))
                                    );
                                }}
                            />
                        </PopoverContent>
                    </Popover>

                ))}
            </div>


            {/* Actions */}
            <button
                className="w-full rounded-md bg-primary text-white text-xs py-2"
                onClick={() => {
                    const next = colors.map(
                        () =>
                            "#" +
                            Math.floor(Math.random() * 16777215)
                                .toString(16)
                                .padStart(6, "0")
                    );
                    next.forEach((c, i) =>
                        editor.replaceIconColor(colors[i], c)
                    );
                    setColors(next);
                }}
            >
                Randomize colors
            </button>
        </aside>
    );
};