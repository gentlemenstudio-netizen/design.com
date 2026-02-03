"use client";

import { useEffect, useState, useMemo } from "react";
import { HexColorPicker } from "react-colorful";
import { ActiveTool, Editor } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";

const FRESH_COLORS = [
    "#F8FAFC", "#000000", "#6366F1", "#8B5CF6", "#EC4899", 
    "#EF4444", "#F59E0B", "#10B981", "#06B6D4", "#3B82F6",
    "#1E293B", "#71717A"
];

interface Props {
    editor: Editor | undefined;
    activeTool: string;
    onChangeActiveTool: (tool: ActiveTool) => void; // Add this line
    onClose: () => void;
}

export const BackgroundSidebar = ({ editor, activeTool, onChangeActiveTool, onClose }: Props) => {
    const [color, setColor] = useState("#ffffff");

    // 1. Sync state with actual workspace color on open
    useEffect(() => {
        if (activeTool === "bgcolor") {
            const workspace = editor?.getWorkspace();
            if (workspace) {
                setColor(workspace.fill as string || "#ffffff");
            }
        }
    }, [activeTool, editor]);

    // 2. Extract unique colors from current logo objects (Logo Colors)
    const logoColors = useMemo(() => {
        if (!editor?.canvas) return [];
        const objects = editor.canvas.getObjects();
        const colors = new Set<string>();

        objects.forEach((obj) => {
            if (obj.name === "clip") return; // Ignore workspace background
            if (typeof obj.fill === "string") colors.add(obj.fill);
            if (typeof obj.stroke === "string") colors.add(obj.stroke);
        });

        return Array.from(colors).filter(c => c && c !== "transparent").slice(0, 6);
    }, [editor?.canvas, activeTool]);

    if (activeTool !== "bgcolor" || !editor) return null;

    const handleColorChange = (value: string) => {
        setColor(value);
        editor.changeBackground(value);
    };

    return (
        <aside className="bg-white relative z-[40] w-[360px] h-full flex flex-col border-r">
            <ToolSidebarHeader 
                title="Background" 
                description="Change the background color of your project" 
            />
            
            <ScrollArea className="flex-1 px-4">
                <div className="py-6 space-y-6">
                    {/* Custom Picker - Immediate Apply */}
                    <div className="space-y-4">
                        <HexColorPicker 
                            color={color} 
                            onChange={handleColorChange} 
                            className="!w-full"
                        />
                    </div>

                    {/* Logo/Document Colors (Extracted from your logo) */}
                    {logoColors.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase text-slate-500">Logo Colors</p>
                            <div className="flex flex-wrap gap-2">
                                {logoColors.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => handleColorChange(c)}
                                        className="h-8 w-8 rounded-full border border-slate-200 shadow-sm"
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Fresh Default Colors */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold uppercase text-slate-500">Fresh Palette</p>
                        <div className="grid grid-cols-6 gap-2">
                            {FRESH_COLORS.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => handleColorChange(c)}
                                    className="h-8 w-8 rounded-md hover:scale-110 transition border border-slate-100"
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>
            
            <ToolSidebarClose onClick={onClose} />
        </aside>
    );
};