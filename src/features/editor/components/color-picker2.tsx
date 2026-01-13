"use client";

import { HexColorPicker } from "react-colorful";

interface Props {
    color: string;
    onChange: (color: string) => void;
}

export const ColorPicker = ({ color, onChange }: Props) => {
    return (
        <div className="rounded-md border bg-background p-3 shadow-md w-[180px]">
            <HexColorPicker color={color} onChange={onChange} />

            <div className="mt-2 text-xs text-muted-foreground text-center">
                {color.toUpperCase()}
            </div>
        </div>
    );
};
