
import WebFont from "webfontloader";
import { GOOGLE_FONTS } from "./fonts";

export function loadCanvasFonts(): Promise<void> {
    return new Promise((resolve) => {
        const families = GOOGLE_FONTS.flatMap((font) =>
            font.weights.map((w) => `${font.family}:${w}`)
        );

        WebFont.load({
            google: {
                families,
            },
            active: () => resolve(),
            inactive: () => resolve(), // don't block editor
        });
    });
}
