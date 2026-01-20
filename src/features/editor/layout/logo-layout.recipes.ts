import { LogoLayoutId } from "./logo-layout.types";

export type LogoLayoutRecipe = {
    direction: "vertical" | "horizontal";
    iconPosition: "start" | "end" | "center";
    iconScale: number;
    textScale: number;
    spacing: number;
};

export const LOGO_LAYOUT_RECIPES: Record<
    LogoLayoutId,
    LogoLayoutRecipe
> = {
    "icon-top": {
        direction: "vertical",
        iconPosition: "start",
        iconScale: 1,
        textScale: 1.5,
        spacing: 20,
    },

    "icon-top-big": {
        direction: "vertical",
        iconPosition: "start",
        iconScale: 1.5,
        textScale: 1,
        spacing: 20,
    },

    "icon-left": {
        direction: "horizontal",
        iconPosition: "start",
        iconScale: 0.15,
        textScale: 1,
        spacing: 32,
    },

    "icon-left-big": {
        direction: "horizontal",
        iconPosition: "start",
        iconScale: 1.5,
        textScale: 0.85,
        spacing: 36,
    },

    "icon-only": {
        direction: "vertical",
        iconPosition: "center",
        iconScale: 1.6,
        textScale: 0,
        spacing: 0,
    },

    "text-only": {
        direction: "vertical",
        iconPosition: "center",
        iconScale: 0,
        textScale: 1.3,
        spacing: 0,
    },
    "icon-bottom": {
        direction: "vertical",
        iconPosition: "start",
        iconScale: 0,
        textScale: 0,
        spacing: 0
    },
    "icon-right": {
        direction: "vertical",
        iconPosition: "start",
        iconScale: 0.15,
        textScale: 1,
        spacing: 32,
    },
    "icon-left-small": {
        direction: "vertical",
        iconPosition: "start",
        iconScale: 0,
        textScale: 0,
        spacing: 0
    },
    "icon-top-small": {
        direction: "vertical",
        iconPosition: "start",
        iconScale: 0,
        textScale: 0,
        spacing: 0
    }
};
