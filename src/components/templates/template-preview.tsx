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
        canvas.setWidth(PREVIEW_WIDTH);
        canvas.setHeight(PREVIEW_HEIGHT);

        canvas.loadFromJSON(json, () => {
            // 1️⃣ Grab loaded objects FIRST
            const objects = canvas.getObjects();
            if (!objects.length) {
                canvas.renderAll();
                return;
            }

            // 2️⃣ Remove them from canvas (do NOT clear)
            objects.forEach(obj => canvas.remove(obj));

            // 3️⃣ Group objects
            const group = new fabric.Group(objects, {
                selectable: false,
                evented: false,
            });

            // 4️⃣ Scale to fit preview
            const scale = Math.min(
                PREVIEW_WIDTH / group.width!,
                PREVIEW_HEIGHT / group.height!
            ) * 0.9; // breathing space like Design.com

            group.scale(scale);

            // 5️⃣ Center perfectly
            group.set({
                left: PREVIEW_WIDTH / 2,
                top: PREVIEW_HEIGHT / 2,
                originX: "center",
                originY: "center",
            });

            // 6️⃣ Reset viewport (CRITICAL)
            canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

            // 7️⃣ Add grouped preview
            canvas.add(group);
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
