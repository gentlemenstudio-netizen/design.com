"use client";

import { HexColorPicker } from "react-colorful";
import { Editor } from "../types";
import { useState } from "react";

const DEFAULT_COLORS = [
    "#000000", "#4B4B4B", "#9E9E9E", "#E0E0E0", "#FFFFFF",
    "#FF5252", "#FF80AB", "#7C4DFF", "#448AFF",
    "#40C4FF", "#69F0AE", "#FFD740",
];

const GRADIENTS = [
    ["#ff9966", "#ff5e62"],
    ["#36d1dc", "#5b86e5"],
    ["#7F00FF", "#E100FF"],
    ["#56ab2f", "#a8e063"],
];

interface Props {
    editor: Editor | undefined;
    activeTool: string;
    onChangeActiveTool: (tool: any) => void;
}


export const BackgroundSidebar = ({ editor, activeTool }: Props) => {

    const [customColor, setCustomColor] = useState("#ff0055");

    if (activeTool !== "bgcolor" || !editor) return null;



    const applyColor = (color: string) => {
        editor.changeBackground(color);
    };

    // const applyGradient = (colors: string[]) => {
    //     const gradient = new fabric.Gradient({
    //         type: "linear",
    //         gradientUnits: "percentage",
    //         coords: { x1: 0, y1: 0, x2: 0, y2: 1 },
    //         colorStops: colors.map((c, i) => ({
    //             offset: i / (colors.length - 1),
    //             color: c,
    //         })),
    //     });

    //     // editor.changeBackground(gradient);
    //     //editor.changeBackground(""); // Force re-render
    // };

    const clearBackground = () => {
        editor.changeBackground("");
    };

    return (
        <div className="p-4 space-y-4">
            <h3 className="font-semibold">Edit Background</h3>

            {/* New Color */}
            <div>
                <p className="text-sm mb-2">New color</p>
                <HexColorPicker color={customColor} onChange={setCustomColor} />
                <button
                    className="mt-2 w-full rounded border p-2"
                    onClick={() => applyColor(customColor)}
                >
                    Add color
                </button>
            </div>

            {/* Default Colors */}
            <div>
                <p className="text-sm mb-2">Default colors</p>
                <div className="grid grid-cols-6 gap-2">
                    {DEFAULT_COLORS.map((c) => (
                        <button
                            key={c}
                            onClick={() => applyColor(c)}
                            className="h-8 w-8 rounded"
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </div>

            {/* Gradient Colors */}
            {/* <div>
                <p className="text-sm mb-2">Gradient colors</p>
                <div className="grid grid-cols-5 gap-2">
                    {GRADIENTS.map((g, i) => (
                        <button
                            key={i}
                            onClick={() => applyGradient(g)}
                            className="h-10 w-10 rounded"
                            style={{
                                background: `linear-gradient(${g.join(",")})`,
                            }}
                        />
                    ))}
                </div>
            </div> */}

            <button
                className="w-full border rounded py-2"
            // onClick={() => editor.clearBackground()}
            >
                Clear background
            </button>
        </div>
    );
}
