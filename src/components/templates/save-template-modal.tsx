"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
    json: any;
    width: number;
    height: number;
    onClose: () => void;
}

export const SaveTemplateModal = ({
    json,
    width,
    height,
    onClose,
}: Props) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("logo");
    const [loading, setLoading] = useState(false);

    const onSave = async () => {
        setLoading(true);

        await fetch("/api/templates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name || "Template",
                category,
                json,
                width,
                height,
            }),
        });

        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 space-y-4">
                <h2 className="text-lg font-semibold">Save as Template</h2>

                <input
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Template name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <select
                    className="w-full border px-3 py-2 rounded"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="logo">Logo</option>
                    <option value="business-card">Business Card</option>
                    <option value="flyer">Flyer</option>
                </select>

                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onSave} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
