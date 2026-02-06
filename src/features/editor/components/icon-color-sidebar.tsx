"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Editor, ActiveTool } from "@/features/editor/types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";


const FRESH_PALETTE = [
  "#000000", "#FFFFFF", "#6366F1", "#8B5CF6", "#EC4899", 
  "#EF4444", "#F59E0B", "#10B981", "#06B6D4", "#3B82F6"
];

interface Props {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const IconColorSidebar = ({ editor, activeTool, onChangeActiveTool }: Props) => {
  const [colors, setColors] = useState<string[]>([]);
  const [gradients, setGradients] = useState<any[]>([]);

  
  
  // Use a ref to track the last signature to avoid update loops
  const lastSigRef = useRef<string | null>(null);

  // 1. Function to fetch data from the canvas
  const updateSidebarData = useCallback(() => {
    if (!editor) return;
    const iconColors = editor.getIconColors();
    const iconGradients = editor.getIconGradients();
    
    setColors(iconColors);
    setGradients(iconGradients);
  }, [editor]);

  // 2. Auto-load on open or selection change
  useEffect(() => {
    if (activeTool === "iconColor") {
      updateSidebarData();
    }
  }, [activeTool, editor?.selectedObjects, updateSidebarData]);

  // 3. Handle Solid Color Updates
  const handleColorChange = (oldColor: string, newColor: string) => {
    editor?.replaceIconColor(oldColor, newColor);
    // Optimistic update for UI smoothness
    setColors((prev) => prev.map(c => c === oldColor ? newColor : c));
  };

  // 4. Handle Gradient Stop Updates with Signature Sync
  const handleGradientChange = (sig: string, stopIdx: number, newColor: string) => {
    if (!editor) return;

    // Update Canvas
    editor.updateIconGradientStop(sig, stopIdx, newColor);

    // Update Local State & Rotate Signature
    setGradients((prevGradients) => {
      return prevGradients.map((g) => {
        if (g.signature === sig) {
          const newStops = [...g.stops];
          newStops[stopIdx] = { ...newStops[stopIdx], color: newColor };
          
          // Generate new signature based on updated colors
          const newSignature = newStops.map((s: any) => s.color).join(",");
          
          return {
            ...g,
            signature: newSignature,
            stops: newStops
          };
        }
        return g;
      });
    });
  };

  if (activeTool !== "iconColor") return null;

 return (
    <aside className="bg-white relative z-[40] w-[360px] h-full flex flex-col border-r">
      <ToolSidebarHeader 
        title="Icon Colors" 
        description="Modify the colors and gradients of your logo" 
      />

      <ScrollArea className="flex-1 px-4">
        <div className="py-6 space-y-6">
          
          {/* SOLID COLORS */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Solid Colors</p>
            <div className="flex flex-wrap gap-3">
              {colors.map((color, index) => (
                <Popover key={`solid-${index}-${color}`}>
                  <PopoverTrigger asChild>
                    <button 
                      className="h-10 w-10 rounded-full border shadow-sm ring-offset-2 hover:ring-2 ring-indigo-500 transition-all"
                      style={{ backgroundColor: color }}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit p-3">
                    <HexColorPicker 
                      color={color} 
                      onChange={(newColor) => handleColorChange(color, newColor)} 
                    />
                    {/* CUSTOM INPUT FOR SOLID COLOR */}
                    <div className="mt-3 flex items-center gap-x-2">
                        <input 
                            defaultValue={color}
                            key={color} // Forces re-render when selection changes
                            onChange={(e) => {
                              const val = e.target.value;
                              if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
                                  handleColorChange(color, val);
                              }
                            }}
                            className="w-full border p-1.5 text-xs uppercase rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center"
                            placeholder="#HEX"
                        />
                    </div>
                    <div className="mt-3 grid grid-cols-5 gap-1">
                      {FRESH_PALETTE.map((p) => (
                        <button 
                          key={p} 
                          className="h-6 w-6 rounded-sm border hover:scale-110 transition" 
                          style={{ backgroundColor: p }}
                          onClick={() => handleColorChange(color, p)}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>

          {/* GRADIENTS */}
          {gradients.length > 0 && (
            <div className="space-y-4 pt-6 border-t">
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Gradients</p>
              {gradients.map((g) => (
                <div key={g.signature} className="p-4 bg-slate-50 rounded-xl space-y-4">
                   <div 
                      className="h-6 w-full rounded-md border shadow-inner" 
                      style={{ background: `linear-gradient(to right, ${g.stops.map((s: any) => s.color).join(",")})` }} 
                   />
                   <div className="flex gap-3">
                    {g.stops.map((stop: any, sIdx: number) => (
                      <div key={`${g.signature}-stop-${sIdx}`} className="space-y-1 text-center">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button 
                              className="h-10 w-10 rounded-lg border-2 border-white shadow-md hover:scale-105 transition"
                              style={{ backgroundColor: stop.color }}
                            />
                          </PopoverTrigger>
                          <PopoverContent className="w-fit p-3">
                            <HexColorPicker 
                              color={stop.color} 
                              onChange={(newColor) => handleGradientChange(g.signature, sIdx, newColor)} 
                            />
                            {/* CUSTOM INPUT FOR GRADIENT STOP */}
                            <div className="mt-3 flex items-center gap-x-2">
                                <input 
                                    defaultValue={stop.color}
                                    key={stop.color}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
                                          handleGradientChange(g.signature, sIdx, val);
                                      }
                                    }}
                                    className="w-full border p-1.5 text-xs uppercase rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center"
                                    placeholder="#HEX"
                                />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <p className="text-[10px] text-slate-400 font-medium">Stop {sIdx + 1}</p>
                      </div>
                    ))}
                   </div>
                </div>
              ))}
            </div>
          )}
          {/* ... (keep existing shuffle button) */}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={() => onChangeActiveTool("select")} />
    </aside>
  );
};