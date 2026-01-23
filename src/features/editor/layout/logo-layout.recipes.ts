import { LogoLayoutId } from "./logo-layout.types";
type IconSizeMode = "big" | "normal" | "small";
export type LogoLayoutRecipe = {
    direction: "top" | "bottom" | "left" | "right"
    iconPosition: "start" | "end" | "center";
    spacing: number;
    brandAlign: "left" | "center" | "right";
    taglineAlign: "left" | "center" | "right";
    iconSize?: IconSizeMode;

};

export const LOGO_LAYOUT_RECIPES: Record<
    LogoLayoutId,
    LogoLayoutRecipe
> = {
    "icon-top": {
        direction: "top",
        iconPosition: "start",
        spacing: 1,
        brandAlign: "center",
        taglineAlign: "center",
        iconSize: "normal"
    },
    "icon-top-small": {
        direction: "top",
        iconPosition: "start",
        spacing: 0,
        brandAlign: "center",
        taglineAlign: "center",
        iconSize: "small"
    },
    "icon-top-big": {
        direction: "top",
        iconPosition: "start",
        spacing: 10,
        brandAlign: "center",
        taglineAlign: "center",
        iconSize: "big"
    },
    "icon-left-big": {
        direction: "left",
        iconPosition: "start",
        spacing: 1,
        brandAlign: "left",
        taglineAlign: "left",
        iconSize: "big"
    },

    "icon-left": {
        direction: "left",
        iconPosition: "start",
        spacing: 5,
        brandAlign: "left",
        taglineAlign: "left",
        iconSize: "normal"
    },



    "icon-only": {
        direction: "top",
        iconPosition: "center",
        spacing: 0,
        brandAlign: "left",
        taglineAlign: "left",
        iconSize: "big"
    },

    "text-only": {
        direction: "top",
        iconPosition: "center",
        spacing: 0,
        brandAlign: "center",
        taglineAlign: "center",
        iconSize: "normal"
    },
    "icon-bottom": {
        direction: "bottom",
        iconPosition: "start",
        spacing: 0,
        brandAlign: "center",
        taglineAlign: "center",
        iconSize: "normal"
    },
    "icon-right": {
        direction: "right",
        iconPosition: "start",
        spacing: 5,
        brandAlign: "right",
        taglineAlign: "right",
        iconSize: "normal"
    },
    "icon-left-small": {
        direction: "left",
        iconPosition: "start",
        spacing: 0,
        brandAlign: "center",
        taglineAlign: "center",
        iconSize: "small"
    },

};
