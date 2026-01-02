"use client";

import { normalizeTemplate } from "@/lib/normalize-template";
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

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width,
            height,
            selection: false,
        });
        (async () => {
            const normalized = await normalizeTemplate(json);

            canvas.loadFromJSON(normalized, () => {
                canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

                const scale = Math.min(
                    width / normalized.width,
                    height / normalized.height
                );

                canvas.setZoom(scale);
                canvas.relativePan({
                    x: (width / scale - normalized.width) / 2,
                    y: (height / scale - normalized.height) / 2,
                });

                canvas.getObjects().forEach((obj) => {
                    obj.selectable = false;
                    obj.evented = false;
                });

                canvas.renderAll();
            });
        })();

        return () => {
            canvas.dispose();
        };
    }, [json, width, height]);

    return (
        <div
            onClick={onClick}
            className="cursor-pointer rounded-lg border bg-white p-2 hover:ring-2 hover:ring-primary transition"
        >
            <canvas ref={canvasRef} />
        </div>
    );
};
