import { LogoLayoutId } from "./logo-layout.types";

export type LogoLayoutItem = {
    id: LogoLayoutId;
    label: string;
    preview: "icon-top" | "icon-bottom" | "icon-left" | "icon-right";
};

export const LOGO_LAYOUT_ITEMS: LogoLayoutItem[] = [
    {
        id: "icon-top",
        label: "Icon Top",
        preview: "icon-top",
    },
    {
        id: "icon-bottom",
        label: "Icon Bottom",
        preview: "icon-bottom",
    },
    {
        id: "icon-left",
        label: "Icon Left",
        preview: "icon-left",
    },
    {
        id: "icon-right",
        label: "Icon Right",
        preview: "icon-right",
    },
    {
        id: "icon-top-big",
        label: "Icon Top (Big)",
        preview: "icon-top",
    },
    {
        id: "icon-left-big",
        label: "Icon Left (Big)",
        preview: "icon-left",
    },
    {
        id: "icon-only",
        label: "Icon Only",
        preview: "icon-top",
    },
    {
        id: "text-only",
        label: "Text Only",
        preview: "icon-top",
    },
];
