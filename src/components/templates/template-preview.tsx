"use client";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import { loadCanvasFonts } from "@/lib/load-canvas-fonts";
import { patchCanvasTextBaseline } from "@/lib/patch-canvas-textbaseline";
import { cn } from "@/lib/utils";
import { Edit3, Loader2, Trash } from "lucide-react";

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
    const [isRedirecting, setIsRedirecting] = useState(false); // NEW: Loading state

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            setIsRedirecting(true);
            onClick();
        }
    };

    const renderManually = async () => {
        const canvas = fabricRef.current;
        const container = containerRef.current;

        if (!canvas || !container || !json?.objects) return;

        const width = container.offsetWidth;
        const height = container.offsetHeight;
        const CENTER_X = width / 2;
        const PADDING = width < 500 ? 16 : 24;

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

        let currentTop = width < 300 ? 16 : 30; // Start a bit lower

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
                    fontSize: width < 300 ? 32 : 42,
                    lineHeight: 0.9,
                    fontFamily: brandData.fontFamily || "Arial",
                    fill: brandData.fill || "#000000",
                    fontWeight: brandData.fontWeight || "bold",
                    charSpacing: brandData.charSpacing || 0,
                    textAlign: "center",
                    width: width - (PADDING * 2), // Set the boundary
                    splitByGrapheme: false, // Prevents breaking words in the middle
                    selectable: false,
                    shadow: brandData.shadow ? new fabric.Shadow(brandData.shadow) : undefined,
                    stroke: brandData.stroke ? brandData.stroke : undefined,
                    strokeWidth: brandData.strokeWidth || 0,
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
                        top: brandBottom - 5,
                        originX: "center",
                        originY: "top",
                        fontSize: width < 300 ? 8 : 16,
                        fontFamily: taglineData.fontFamily || "Arial",
                        fill: taglineData.fill || "#666666",
                        textAlign: "center",
                        width: width - PADDING * 2,
                        charSpacing: taglineData.charSpacing || 0,
                        selectable: false,
                        shadow: taglineData.shadow ? new fabric.Shadow(taglineData.shadow) : undefined,
                        stroke: taglineData.stroke ? taglineData.stroke : undefined,
                        strokeWidth: taglineData.strokeWidth || 0,
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
        <div className="group relative flex flex-col">
            <div
                ref={containerRef}
                className={cn(
                    "relative w-full border rounded-2xl overflow-hidden aspect-[1.24/1] shadow-sm bg-white cursor-pointer transition-all duration-300",
                    "hover:shadow-xl hover:border-brand-primary/20",
                    isRedirecting && "cursor-wait"
                )}
                onClick={handleEditClick}
                style={{ cursor: 'pointer' }}
            >
                {!ready && <div className="absolute inset-0 bg-slate-50 animate-pulse" />}

                <div className="absolute inset-0 pointer-events-none">
                    <canvas ref={canvasRef} />
                </div>


                {/* 1. HOVER BUTTON OVERLAY */}


                {/* 2. LOADING SCREEN (Fades in after click) */}
                {isRedirecting && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-in fade-in duration-300">
                        <div className="relative">
                            <Loader2 className="size-10 text-white animate-spin" />
                            <div className="absolute inset-0 blur-lg bg-brand-primary/50 animate-pulse" />
                        </div>
                        <p className="mt-4 text-white text-[10px] font-black tracking-[0.2em] uppercase">
                            Initializing Canvas
                        </p>
                    </div>
                )}
            </div>

            {/* Admin Controls (Stay below as requested or if needed) */}
            {admin && (
                <div className="mt-3 flex gap-2">
                    <button onClick={onEdit} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 text-[10px] py-2.5 rounded-xl font-bold transition-colors">EDIT SOURCE</button>
                    <button onClick={onDelete} className="px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors">
                        <Trash className="size-4" />
                    </button>
                </div>
            )}
        </div>
    );
};