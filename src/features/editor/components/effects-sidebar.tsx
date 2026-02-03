"use client";

import { useEffect, useState } from "react";
import { Editor, TextEffects } from "@/features/editor/types";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface EffectsSidebarProps {
    editor: Editor | undefined;
    activeTool: string;
    onClose: () => void;
}

export const EffectsSidebar = ({
    editor,
    activeTool,
    onClose,
}: EffectsSidebarProps) => {
    // Drop Shadow States
    const [hasShadow, setHasShadow] = useState(false);
    const [shadowColor, setShadowColor] = useState("#000000");
    const [shadowBlur, setShadowBlur] = useState(10);
    const [shadowOffsetX, setShadowOffsetX] = useState(5);
    const [shadowOffsetY, setShadowOffsetY] = useState(5);
    const [shadowOpacity, setShadowOpacity] = useState(0.5);

    // Outline States
    const [hasOutline, setHasOutline] = useState(false);
    const [outlineColor, setOutlineColor] = useState("#000000");
    const [outlineThickness, setOutlineThickness] = useState(2);

    // 1. Load existing state from the selected object
    useEffect(() => {
        const selectedObject = editor?.selectedObjects[0];
        if (!selectedObject) return;

        // Load Shadow
        const shadow = selectedObject.shadow as any;
        if (shadow) {
            setHasShadow(true);
            setShadowColor(shadow.color.split(',').length > 3 ? rgbToHex(shadow.color) : shadow.color);
            setShadowBlur(shadow.blur || 0);
            setShadowOffsetX(shadow.offsetX || 0);
            setShadowOffsetY(shadow.offsetY || 0);
        } else {
            setHasShadow(false);
        }

        // Load Outline
        if (selectedObject.stroke && selectedObject.strokeWidth! > 0) {
            setHasOutline(true);
            setOutlineColor(selectedObject.stroke as string);
            setOutlineThickness(selectedObject.strokeWidth || 0);
        } else {
            setHasOutline(false);
        }
    }, [editor?.selectedObjects, activeTool]);

    const applyEffects = (overrides?: any) => {
        const settings = {
            hasShadow,
            shadowColor,
            shadowBlur,
            shadowOffsetX,
            shadowOffsetY,
            shadowOpacity,
            hasOutline,
            outlineColor,
            outlineThickness,
            ...overrides
        };

        editor?.updateTextEffects({
            shadow: settings.hasShadow ? {
                color: hexToRgba(settings.shadowColor, settings.shadowOpacity),
                blur: settings.shadowBlur,
                offsetX: settings.shadowOffsetX,
                offsetY: settings.shadowOffsetY,
            } : undefined,
            outline: settings.hasOutline ? {
                color: settings.outlineColor,
                thickness: settings.outlineThickness,
            } : undefined,
        });
    };

    return (
        <aside className={cn("bg-white relative z-[40] w-[360px] h-full flex flex-col border-r", activeTool === "effects" ? "visible" : "hidden")}>
            <ToolSidebarHeader title="Effects" description="Add shadows and outlines to your text" />
            
            <ScrollArea className="flex-1 px-4">
                {/* ===== DROP SHADOW ===== */}
                <div className="py-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold">Drop Shadow</Label>
                        <Switch 
                            checked={hasShadow} 
                            onCheckedChange={(val: boolean) => {
                                setHasShadow(val);
                                applyEffects({ hasShadow: val });
                            }} 
                        />
                    </div>

                    {hasShadow && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                             <div className="space-y-2">
                                <div className="flex justify-between"><Label className="text-xs">Blur</Label><span className="text-xs text-muted-foreground">{shadowBlur}</span></div>
                                <Slider value={[shadowBlur]} max={50} step={1} onValueChange={(v) => { setShadowBlur(v[0]); applyEffects({ shadowBlur: v[0] }); }} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Offset X</Label>
                                    <Slider value={[shadowOffsetX]} min={-20} max={20} onValueChange={(v) => { setShadowOffsetX(v[0]); applyEffects({ shadowOffsetX: v[0] }); }} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Offset Y</Label>
                                    <Slider value={[shadowOffsetY]} min={-20} max={20} onValueChange={(v) => { setShadowOffsetY(v[0]); applyEffects({ shadowOffsetY: v[0] }); }} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-xs">Color</Label>
                                <input type="color" value={shadowColor} onChange={(e) => { setShadowColor(e.target.value); applyEffects({ shadowColor: e.target.value }); }} className="w-8 h-8 rounded-full border-none cursor-pointer" />
                            </div>
                        </div>
                    )}
                </div>

                {/* ===== OUTLINE ===== */ }
                <div className="py-6 space-y-6 border-t">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold">Outline</Label>
                        <Switch 
                            checked={hasOutline} 
                            onCheckedChange={(val: boolean) => {
                                setHasOutline(val);
                                applyEffects({ hasOutline: val });
                            }} 
                        />
                    </div>

                    {hasOutline && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                            <div className="space-y-2">
                                <div className="flex justify-between"><Label className="text-xs">Thickness</Label><span className="text-xs text-muted-foreground">{outlineThickness}</span></div>
                                <Slider value={[outlineThickness]} max={20} step={1} onValueChange={(v) => { setOutlineThickness(v[0]); applyEffects({ outlineThickness: v[0] }); }} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-xs">Color</Label>
                                <input type="color" value={outlineColor} onChange={(e) => { setOutlineColor(e.target.value); applyEffects({ outlineColor: e.target.value }); }} className="w-8 h-8 rounded-full border-none cursor-pointer" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <ToolSidebarClose onClick={onClose} />
        </aside>
    );
};

// Helpers
const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const rgbToHex = (rgba: string) => {
    const match = rgba.match(/\d+/g);
    if (!match) return "#000000";
    return "#" + match.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
};