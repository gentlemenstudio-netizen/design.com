
import WebFont from "webfontloader";
import { GOOGLE_FONTS } from "./fonts";

let fontsPromise: Promise<void> | null = null;

export function loadCanvasFonts(): Promise<void> {
    if (!fontsPromise) {
        fontsPromise = new Promise((resolve) => {
            WebFont.load({
                google: {
                    families: GOOGLE_FONTS.flatMap((f) =>
                        f.weights.map((w) => `${f.family}:${w}`)
                    ),
                },
                active: resolve,
                inactive: resolve,
            });
        });
    }

    return fontsPromise;
}
