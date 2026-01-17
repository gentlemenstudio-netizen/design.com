export type LogoLayoutId =
    | "icon-top"
    | "icon-bottom"
    | "icon-left"
    | "icon-right"
    | "icon-only"
    | "text-only";

export const LOGO_LAYOUTS: {
    id: LogoLayoutId;
    label: string;
}[] = [
        { id: "icon-top", label: "Icon Top" },
        { id: "icon-bottom", label: "Icon Bottom" },
        { id: "icon-left", label: "Icon Left" },
        { id: "icon-right", label: "Icon Right" },
        { id: "icon-only", label: "Icon Only" },
        { id: "text-only", label: "Text Only" },
    ];
