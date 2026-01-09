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
    width = 260,
    height = 260,
    onClick,
    onEdit,
    onDelete,
}: TemplatePreviewProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const [ready, setReady] = useState(false);

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
                width,
                height,
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

        canvas.loadFromJSON(json, () => {
            canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

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

            const contentWidth = maxX - minX;
            const contentHeight = maxY - minY;

            const scale = Math.min(
                width / contentWidth,
                height / contentHeight
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
    }, [json, ready, width, height]);

    return (
        <div>
            <div
                onClick={onClick}
                className="
        cursor-pointer
        rounded-xl
        border
        bg-white
        aspect-square
        flex
        items-center
        justify-center
        p-4
        transition
        hover:shadow-md
        hover:border-primary
      "
            >
                {!ready && (
                    <div className="w-full h-full bg-muted animate-pulse rounded-lg" />
                )}
                <canvas ref={canvasRef} />
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
