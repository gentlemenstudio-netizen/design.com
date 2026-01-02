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
    width = 220,
    height = 220,
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

        canvas.loadFromJSON(json, () => {
            const originalWidth = json.width || 900;
            const originalHeight = json.height || 900;

            const scaleX = width / originalWidth;
            const scaleY = height / originalHeight;
            const scale = Math.min(scaleX, scaleY);

            canvas.getObjects().forEach((obj) => {
                obj.scaleX! *= scale;
                obj.scaleY! *= scale;
                obj.left! *= scale;
                obj.top! *= scale;
                obj.selectable = false;
                obj.evented = false;
            });

            canvas.renderAll();
        });

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
