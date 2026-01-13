"use client";

import { loadSvgIntoCanvas } from "@/lib/import-svg-into-canvas";

interface Props {
    editor: any;
    onClose: () => void;
}

export const AdminSvgUploadButton = ({
    editor,
    onClose,
}: Props) => {

    const handleUpload = async (file: File) => {
        const svgText = await file.text();

        const res = await fetch("/api/admin/validate-svg", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ svg: svgText }),
        });

        const data = await res.json();

        if (!data.success) {
            alert(data.error);
            return;
        }

        loadSvgIntoCanvas(editor.canvas, data.svg);
    };

    return (
        <label className="cursor-pointer">
            <input
                type="file"
                accept=".svg"
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                }}
            />
            <div className="px-3 py-2 rounded-md bg-primary text-white text-sm">
                Upload SVG Icon (Admin)
            </div>
        </label>
    );
}
