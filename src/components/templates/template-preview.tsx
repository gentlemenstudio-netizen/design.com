"use client";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import { loadCanvasFonts } from "@/lib/load-canvas-fonts";
import { patchCanvasTextBaseline } from "@/lib/patch-canvas-textbaseline";

patchCanvasTextBaseline();

interface TemplatePreviewProps {
    json: any;
    admin?: boolean;
    onClick?: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onLoaded?: () => void;
}

export const TemplatePreview = ({
    json,
    admin = false,
    onClick,
    onEdit,
    onDelete,
    onLoaded,
}: TemplatePreviewProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const [ready, setReady] = useState(false);

    const renderManually = async () => {
        const canvas = fabricRef.current;
        const container = containerRef.current;
        
        if (!canvas || !container || !json?.objects) return;

        const width = container.offsetWidth;
        const height = container.offsetHeight;
        const CENTER_X = width / 2;
        const PADDING = 24; // Side padding

        canvas.setWidth(width);
        canvas.setHeight(height);
        canvas.clear();

        const rawObjects = json.objects as any[];
        const logoData = rawObjects.find(o => o.customType === "logoIcon");
        const brandData = rawObjects.find(o => o.customRole === "brand");
        const taglineData = rawObjects.find(o => o.customRole === "tagline");
        const backgroundData = rawObjects.find(o => o.type === "rect" || o.name === "clip");

        if (backgroundData?.fill) {
            container.style.backgroundColor = backgroundData.fill;
        }

        let currentTop = 30; // Start a bit lower

        // 1. Render Logo
        if (logoData) {
            fabric.util.enlivenObjects([logoData], (enlivened: fabric.Object[]) => {
                const logo = enlivened[0];
                const currentCanvas = fabricRef.current;
                if (!logo || !currentCanvas) return;

                // Center the internal origin
                logo.set({
                    left: CENTER_X,
                    top: currentTop,
                    originX: "center",
                    originY: "top",
                    selectable: false, // Prevents selection
                    evented: false, // Prevents any events (like hover) from affecting the logo 
                });

                // Increase logo size (50% of card height)
                logo.scaleToHeight(height * 0.48);
                
                // If it's too wide, scale to width
                if (logo.getBoundingRect().width > width - PADDING * 2) {
                    logo.scaleToWidth(width - PADDING * 2);
                }

                currentCanvas.add(logo);
                currentCanvas.renderAll();

                const logoBottom = logo.getBoundingRect().top + logo.getBoundingRect().height;
                renderTextElements(logoBottom + 5);
            }, "");
        } else {
            renderTextElements(currentTop + 40);
        }

        // 2. Render Text with Auto-Size
        function renderTextElements(topPos: number) {
    const currentCanvas = fabricRef.current;
    if (!currentCanvas) return;

    if (brandData) {
        // 1. Create the Brand Textbox
        const brand = new fabric.Textbox(brandData.text || "BRAND", {
            left: CENTER_X,
            top: topPos,
            originX: "center",
            originY: "top",
            fontSize: 42, 
            lineHeight: 0.9,
            fontFamily: brandData.fontFamily || "Arial",
            fill: brandData.fill || "#000000",
            fontWeight: brandData.fontWeight || "bold",
            textAlign: "center",
            width: width - (PADDING * 2), // Set the boundary
            splitByGrapheme: false, // Prevents breaking words in the middle
            selectable: false, 
            evented: false,
            lockMovementX: true, // Extra safety
            lockMovementY: true,
        });

        // 2. Shrink Font to stay on one line
        // We use measureLine(0).width to see how long the actual text is
        let currentBrandSize = brand.fontSize || 40;
        while (brand.measureLine(0).width > (width - PADDING * 2.5) && currentBrandSize > 8) {
            currentBrandSize -= 1;
            brand.set("fontSize", currentBrandSize);
        }
        
        // Final safety: ensure the width of the box is wide enough for the new size
        brand.set("width", width - PADDING); 
        currentCanvas.add(brand);

        // 3. Handle Tagline
        if (taglineData) {
            const brandBottom = brand.getBoundingRect().top + brand.getBoundingRect().height;
            const tagline = new fabric.Textbox(taglineData.text || "", {
                left: CENTER_X,
                top: brandBottom -5,
                originX: "center",
                originY: "top",
                fontSize: 16,
                fontFamily: taglineData.fontFamily || "Arial",
                fill: taglineData.fill || "#666666",
                textAlign: "center",
                width: width - PADDING * 2,
                charSpacing:taglineData.charSpacing || 0,
                selectable: false,
                evented: false,
            });

            let currentTaglineSize = 12;
            while (tagline.measureLine(0).width > (width - PADDING * 2) && currentTaglineSize > 6) {
                currentTaglineSize -= 0.5;
                tagline.set("fontSize", currentTaglineSize);
            }
            currentCanvas.add(tagline);
        }
    }

    currentCanvas.renderAll();
    setReady(true);
    onLoaded?.();
}
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = new fabric.Canvas(canvasRef.current, {
            selection: false,
            interactive: false,  // Disables all mouse interaction
            hoverCursor: "default"
        });
        fabricRef.current = canvas;
        return () => {
            canvas.dispose();
            fabricRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!json) return;
        const init = async () => {
            await loadCanvasFonts();
            renderManually();
        };
        init();

        const observer = new ResizeObserver(() => renderManually());
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [json]);

    return (
        <div className="group relative">
            <div
                ref={containerRef}
                className="relative w-full border rounded-xl overflow-hidden aspect-[1.24/1] shadow-sm bg-white"
                onClick={onClick}
            >
                {!ready && <div className="absolute inset-0 bg-slate-50 animate-pulse" />}
                <canvas ref={canvasRef} />
            </div>

            {admin && (
                <div className="mt-2 flex gap-2">
                    <button onClick={onEdit} className="flex-1 bg-slate-900 text-white text-[10px] py-2 rounded-lg font-bold">EDIT</button>
                    <button onClick={onDelete} className="flex-1 bg-rose-50 text-rose-600 text-[10px] py-2 rounded-lg font-bold">DELETE</button>
                </div>
            )}
        </div>
    );
};