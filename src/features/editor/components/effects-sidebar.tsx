"use client";

import { Editor, TextEffects } from "@/features/editor/types";
import { Input } from "@/components/ui/input";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { set } from "date-fns";
import { FontSizeInput } from "./font-size-input";

interface EffectsSidebarProps {
    editor: Editor | undefined;
    activeTool: string;
    onChangeActiveTool: (tool: any) => void;
}

const polarToCartesian = (distance: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
        x: Math.round(distance * Math.cos(rad)),
        y: Math.round(distance * Math.sin(rad)),
    };
};
const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const EffectsSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: EffectsSidebarProps) => {
    const onClose = () => onChangeActiveTool("select");

    const [outlineThickness, setOutlineThickness] = useState(2);
    const [outlineColor, setOutlineColor] = useState("#000000");

    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(10);
    const [shadowBlur, setShadowBlur] = useState(0);
    const [shadowOpacity, setShadowOpacity] = useState(40);
    const [shadowColor, setShadowColor] = useState("#000000");

    const applyEffects = () => {
        //const { x, y } = polarToCartesian(shadowDistance, shadowAngle);

        editor?.updateTextEffects({
            outline: {
                color: outlineColor,
                thickness: outlineThickness,
            },
            shadow: {
                color: hexToRgba(shadowColor, shadowOpacity / 100),
                blur: shadowBlur,
                offsetX: offsetX,
                offsetY: offsetY,
            },
        });
    };

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
                activeTool === "effects" ? "visible" : "hidden",
            )}
        >
            <ToolSidebarHeader
                title="Effects"
                description="Apply outline and shadow styles"
            />

            <ScrollArea className="flex-1 px-4 py-2 space-y-6">
                {/* ===== SHADOW ===== */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium">Drop Shadow</h4>
                    <div className="shrink-0 h-[56px]  bg-white w-full flex items-center  p-2 gap-x-2">


                        <label className="text-xs">Offset X </label>

                        <Slider
                            min={-100}
                            max={100}
                            step={1}
                            value={[offsetX]}
                            onValueChange={(e) => {
                                setOffsetX(Number(e[0]));
                                applyEffects();
                            }}
                        />
                        <FontSizeInput
                            value={offsetX}
                            onChange={setOffsetX}
                        />
                    </div>
                    <div className="shrink-0 h-[56px]  bg-white w-full flex items-center  p-2 gap-x-2">

                        <label className="text-xs">Offset Y ({offsetY})</label>

                        <Slider
                            min={-100}
                            max={100}
                            step={1}
                            value={[offsetY]}
                            onValueChange={(e) => {
                                setOffsetY(Number(e[0]));
                                applyEffects();
                            }}
                        />
                        <FontSizeInput
                            value={offsetY}
                            onChange={setOffsetY}
                        />
                    </div>
                    <div className="shrink-0 h-[56px]  bg-white w-full flex items-center  p-2 gap-x-2">
                        <label className="text-xs">Blur</label>
                        <Slider
                            min={0}
                            max={50}
                            step={1}
                            value={[shadowBlur]}
                            onValueChange={(e) => {
                                setShadowBlur(Number(e[0]));
                                applyEffects();
                            }}
                        />
                        <FontSizeInput
                            value={shadowBlur}
                            onChange={setShadowBlur}
                        />
                    </div>
                    <div className="shrink-0 h-[56px]  bg-white w-full flex items-center  p-2 gap-x-2">
                        <label className="text-xs">Transparency</label>
                        <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[shadowOpacity]}
                            onValueChange={(e) => {
                                setShadowOpacity(Number(e[0]));
                                applyEffects();
                            }}
                        />
                        <FontSizeInput
                            value={shadowOpacity}
                            onChange={setShadowOpacity}
                        />
                    </div>

                    <div className="flex items-center items-center  p-2 gap-x-2">
                        <span className="text-xs">Color</span>
                        <Input
                            type="color"
                            className="w-12 h-8 p-0"
                            value={shadowColor}
                            onChange={(e) => {
                                setShadowColor(e.target.value);
                                applyEffects();
                            }}
                        />

                    </div>
                </div>

                {/* ===== OUTLINE ===== */}
                <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-medium">Outline</h4>

                    <label className="text-xs">Thickness</label>

                    <Slider
                        min={0}
                        max={50}
                        step={1}
                        value={[outlineThickness]}
                        onValueChange={(e) => {
                            setOutlineThickness(Number(e[0]));
                            applyEffects();
                        }}
                    />

                    <div className="flex items-center justify-between">
                        <span className="text-xs">Color</span>
                        <Input
                            type="color"
                            className="w-12 h-8 p-0"
                            value={outlineColor}
                            onChange={(e) => {
                                setOutlineColor(e.target.value);
                                applyEffects();
                            }}
                        />
                    </div>
                </div>
            </ScrollArea>

            <ToolSidebarClose onClick={onClose} />
        </aside>
    );
};
