"use client";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import { loadCanvasFonts } from "@/lib/load-canvas-fonts";

interface TemplatePreviewProps {
    json: any;
    width?: number;
    height?: number;
    onClick?: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const TemplatePreview = ({
    json,
    width = 360,
    height = 290,
    onClick,
    onEdit,
    onDelete,
}: TemplatePreviewProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const [ready, setReady] = useState(false);
    const PREVIEW_WIDTH = 360;
    const PREVIEW_HEIGHT = 290;

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
                width: PREVIEW_WIDTH,
                height: PREVIEW_HEIGHT,
                selection: false,
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
    }, [width, height]);

    /* =========================
       UPDATE JSON (NO RECREATE)
    ========================= */
    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas || !ready) return;

        // Always reset canvas size for preview


        canvas.loadFromJSON(json, () => {
            canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
            canvas.setWidth(PREVIEW_WIDTH);
            canvas.setHeight(PREVIEW_HEIGHT);
            const objects = canvas.getObjects();
            if (!objects.length) {
                canvas.renderAll();
                return;
            }

            // 🔹 Auto-fit content
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

            const contentWidth = PREVIEW_WIDTH;
            const contentHeight = PREVIEW_HEIGHT;

            const scale = Math.min(

                1 * PREVIEW_WIDTH / (maxX - minX),
                1 * PREVIEW_HEIGHT / (maxY - minY)
            );

            canvas.setZoom(scale);

            canvas.absolutePan({
                x: minX * scale - (width - contentWidth * scale) / 2,
                y: minY * scale - (height - contentHeight * scale) / 2,
            });

            objects.forEach((obj) => {
                obj.selectable = false;
                obj.evented = false;
            });

            canvas.renderAll();
        });
    }, [json, ready]);

    return (
        <div>
            <div

                className="
      relative    
    w-full
    bg-white
    border
    rounded-xl
    overflow-hidden
      "  style={{ aspectRatio: "1.24 / 1" }}
            >
                {!ready && (
                    <div className="w-full h-full bg-muted animate-pulse rounded-lg" />
                )}
                <div className="absolute inset-0 flex items-center justify-center" onClick={onClick}>
                    <canvas ref={canvasRef} />
                </div>
            </div>
            <div
                className="mt-2 flex items-center justify-between space-x-2"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onEdit}
                    className="
          px-3 py-1
          text-xs
          rounded-md
          bg-primary
          text-white
          hover:bg-primary/90
        "
                >
                    Edit
                </button>

                <button
                    onClick={onDelete}
                    className="
          px-3 py-1
          text-xs
          rounded-md
          bg-destructive
          text-white
          hover:bg-destructive/90
        "
                >
                    Delete
                </button>
            </div>
        </div>
    );
};
