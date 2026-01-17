"use client";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import { loadCanvasFonts } from "@/lib/load-canvas-fonts";

import { patchCanvasTextBaseline } from "@/lib/patch-canvas-textbaseline";

patchCanvasTextBaseline();


interface TemplatePreviewProps {
    json: any;
    onClick?: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onLoaded?: () => void;
}

export const TemplatePreview = ({
    json,
    onClick,
    onEdit,
    onDelete,
    onLoaded,
}: TemplatePreviewProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const [ready, setReady] = useState(false);
    const hasReportedLoaded = useRef(false);
    useEffect(() => {
        hasReportedLoaded.current = false;
    }, [json]);


    /* =========================
       INIT CANVAS (ONCE)
    ========================= */
    useEffect(() => {
        let mounted = true;

        const init = async () => {
            if (!canvasRef.current) return;

            await loadCanvasFonts();
            if (!mounted) return;

            fabricRef.current = new fabric.Canvas(canvasRef.current, {
                selection: false,
                skipTargetFind: true,
                renderOnAddRemove: false,
            });

            setReady(true);
        };

        init();

        return () => {
            mounted = false;
            fabricRef.current?.dispose();
            fabricRef.current = null;
        };
    }, []);

    /* =========================
       RESPONSIVE RENDER
    ========================= */
    useEffect(() => {

        const canvas = fabricRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !ready) return;

        const resizeAndRender = () => {
            const { width, height } = container.getBoundingClientRect();
            if (!width || !height) return;

            canvas.setWidth(width);
            canvas.setHeight(height);
            canvas.clear();
            canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
            canvas.setZoom(1);
            canvas.loadFromJSON(json, () => {
                const allObjects = canvas.getObjects();

                // 🔑 Keep only logo-relevant objects
                const objects = allObjects.filter((obj: any) => {
                    return (
                        obj.customType === "logoIcon" ||
                        obj.customRole === "brandName" ||
                        obj.customRole === "tagline"
                    );
                });

                if (!objects.length) {
                    canvas.renderAll();
                    return;
                }

                // 🔹 Bounding box
                let minX = Infinity,
                    minY = Infinity,
                    maxX = -Infinity,
                    maxY = -Infinity;

                objects.forEach((obj) => {
                    const rect = obj.getBoundingRect(true, true);
                    minX = Math.min(minX, rect.left);
                    minY = Math.min(minY, rect.top);
                    maxX = Math.max(maxX, rect.left + rect.width);
                    maxY = Math.max(maxY, rect.top + rect.height);
                });

                const contentWidth = maxX - minX;
                const contentHeight = maxY - minY;

                if (!contentWidth || !contentHeight) return;

                // 🔹 Scale to container
                const scale = Math.min(
                    width / contentWidth,
                    height / contentHeight
                ) * 0.9; // padding

                canvas.setZoom(scale);

                canvas.absolutePan({
                    x: minX * scale - (width - contentWidth * scale) / 2,
                    y: minY * scale - (height - contentHeight * scale) / 2,
                });

                canvas.renderAll();
                if (!hasReportedLoaded.current) {
                    hasReportedLoaded.current = true;
                    onLoaded?.();
                }

            });
        };

        resizeAndRender();


        const observer = new ResizeObserver(resizeAndRender);
        observer.observe(container);

        return () => observer.disconnect();
    }, [json, ready]);

    return (
        <div>
            <div
                ref={containerRef}
                className="
          relative
          w-full
          bg-white
          border
          rounded-xl
          overflow-hidden
          aspect-[1.24/1]
        "
                onClick={onClick}
            >
                {!ready && (
                    <div className="absolute inset-0 bg-muted animate-pulse" />
                )}
                <canvas ref={canvasRef} className="absolute inset-0" />
            </div>

            <div className="mt-2 flex items-center justify-between">
                <button
                    onClick={onEdit}
                    className="px-3 py-1 text-xs rounded-md bg-primary text-white"
                >
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="px-3 py-1 text-xs rounded-md bg-destructive text-white"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};
