export function validateSvg(svg: string) {
    if (!svg || typeof svg !== "string") {
        throw new Error("Invalid SVG input");
    }

    if (svg.length > 200_000) {
        throw new Error("SVG too large (max 200kb)");
    }

    if (!svg.includes("<svg")) {
        throw new Error("Invalid SVG format");
    }

    if (/<script[\s>]/i.test(svg)) {
        throw new Error("SVG scripts not allowed");
    }

    if (/on\w+=/i.test(svg)) {
        throw new Error("Inline event handlers not allowed");
    }

    if (/<image[\s>]/i.test(svg)) {
        throw new Error("External images not allowed");
    }

    return true;
}
