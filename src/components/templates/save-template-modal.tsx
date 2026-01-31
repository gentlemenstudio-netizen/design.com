"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JSON_KEYS } from "@/features/editor/types";
import { transformText } from "@/features/editor/utils";
import { Badge } from "@/components/ui/badge";

interface Props {
    editor: any;
    mode?: "project" | "template";
    templateId?: string;
    onClose: () => void;
}

const LOGO_STYLES = [
    "Abstract", "Mascot", "Emblem", "Corporate", "Wordmark", "Vintage", "Classic"
];

export const SaveTemplateModal = ({
    editor,
    mode,
    templateId,
    onClose,
}: Props) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("logo");
    const [style, setStyle] = useState("Corporate");
    const [loading, setLoading] = useState(false);
    
    // Tag States
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        async function loadTemplateData() {
            if (mode === "template" && templateId) {
                try {
                    const response = await fetch(`/api/templates/${templateId}`);
                    const { data } = await response.json();
                    console.log("Fetched template data:", data);
                    if (data) {
                        setName(data.name || "");
                        setCategory(data.category || "logo");
                        setStyle(data.style || "Corporate");
                        // Ensure tags are handled if they come back as a string or array
                        setTags(Array.isArray(data.tags) ? data.tags : []);
                    }
                } catch (error) {
                    console.error("Failed to fetch template", error);
                }
            }
        }
        loadTemplateData();
    }, [templateId, mode]);

    // 🏷️ Tag Logic: Suggest existing tags after 3 characters
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (tagInput.length >= 3) {
                // Replace with your actual API call: /api/tags?query=${tagInput}
                const response = await fetch(`/api/tags/search?q=${tagInput}`);
                const data = await response.json();
                setSuggestions(data);
            } else {
                setSuggestions([]);
            }
        };
        fetchSuggestions();
    }, [tagInput]);

    const addTag = (tag: string) => {
        const formattedTag = tag.trim().toLowerCase();
        if (formattedTag && !tags.includes(formattedTag)) {
            setTags((prev) => [...prev, formattedTag]);
        }
        setTagInput("");
        setSuggestions([]);
    };

    const removeTag = (tagToRemove: string) => {
        setTags((prev) => prev.filter((t) => t !== tagToRemove));
    };

    const onSave = async () => {
        if (!editor?.canvas) return;
        setLoading(true);

        const canvas = editor.canvas;
        const dataUrl = canvas.toJSON(JSON_KEYS);
        await transformText(dataUrl.objects);

        const payload = {
            name: name || "Template",
            category,
            style,
            tags, // Array of strings for searchability
            json: JSON.stringify(dataUrl),
            width: canvas.getWidth(),
            height: canvas.getHeight(),
        };

        const url = mode === "template" && templateId 
            ? `/api/templates/${templateId}` 
            : "/api/templates";
        
        const method = mode === "template" && templateId ? "PATCH" : "POST";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">
                        {mode === "template" ? "Update Template" : "Configure Template"}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Basic Info */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-500">Template Name</label>
                        <input
                            className="w-full border-slate-200 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            placeholder="e.g. Modern Tech Logo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-500">Category</label>
                            <select
                                className="w-full border-slate-200 border px-4 py-3 rounded-xl outline-none"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="logo">Logo</option>
                                <option value="business-card">Business Card</option>
                                <option value="flyer">Flyer</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-500">Style</label>
                            <select
                                className="w-full border-slate-200 border px-4 py-3 rounded-xl outline-none"
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                            >
                                {LOGO_STYLES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 🏷️ Tagging System */}
                    <div className="space-y-1 relative">
                        <label className="text-xs font-bold uppercase text-slate-500">Search Tags</label>
                        <input
                            className="w-full border-slate-200 border px-4 py-3 rounded-xl outline-none"
                            placeholder="Press Enter to add tags..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    addTag(tagInput);
                                }
                            }}
                        />
                        
                        {/* Suggestions Popover */}
                        {suggestions.length > 0 && (
                            <div className="absolute z-10 w-full bg-white border border-slate-100 shadow-xl rounded-xl mt-1 overflow-hidden">
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => addTag(s)}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-600"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-3">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-x-1">
                                    {tag}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose} className="text-slate-500">
                        Cancel
                    </Button>
                    <Button 
                        onClick={onSave} 
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {mode === "template" ? "Update Template" : "Publish Template"}
                    </Button>
                </div>
            </div>
        </div>
    );
};