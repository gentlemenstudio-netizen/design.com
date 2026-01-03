"use client";

import { fabric } from "fabric";
import { useEffect, useRef } from "react";

interface TemplatePreviewProps {
    json: any;
    width?: number;
    height?: number;
    onClick?: () => void;
}

export const TemplatePreview = ({
    json,
    width = 260,
    height = 260,
    onClick,
}: TemplatePreviewProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        if (!canvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width,
            height,
            selection: false,
            renderOnAddRemove: false,
        });

        fabricRef.current = canvas;

        canvas.loadFromJSON(json, () => {
            if (!mountedRef.current) return;

            // 🔹 RESET viewport (critical)
            canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

            // 🔹 Compute bounds of all objects
            const objects = canvas.getObjects();
            if (!objects.length) return;

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

            // 🔹 Scale to fit preview
            const scale = Math.min(
                width / contentWidth,
                height / contentHeight
            );

            canvas.setZoom(scale);

            // 🔹 Center content
            canvas.absolutePan({
                x: minX * scale - (width - contentWidth * scale) / 2,
                y: minY * scale - (height - contentHeight * scale) / 2,
            });

            // 🔹 Disable interactions
            objects.forEach((obj) => {
                obj.selectable = false;
                obj.evented = false;
            });

            canvas.renderAll();
        });

        return () => {
            mountedRef.current = false;
            fabricRef.current?.dispose();
            fabricRef.current = null;
        };
    }, [json, width, height]);

    return (
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
            <canvas ref={canvasRef} className="max-w-full max-h-full" />
        </div>

    );
};
