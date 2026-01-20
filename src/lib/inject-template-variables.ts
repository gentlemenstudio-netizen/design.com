import { fabric } from "fabric";

/**
 * Replaces brand & tagline text in Fabric JSON
 * without mutating the original JSON
 */
export function injectTemplateVariables(
    json: any,
    vars: {
        BRAND_NAME?: string;
        TAGLINE?: string;
    }
) {
    if (!json || !json.objects) return json;

    // 🔒 Deep clone JSON (important)
    const cloned = JSON.parse(JSON.stringify(json));

    cloned.objects = cloned.objects.map((obj: any) => {
        // 🔹 GROUP (logo icon etc.)
        if (obj.type === "group" && Array.isArray(obj.objects)) {
            obj.objects = obj.objects.map((child: any) =>
                injectText(child, vars)
            );
            return obj;
        }

        return injectText(obj, vars);
    });

    return cloned;
}

/**
 * Inject text into Fabric Text / IText / Textbox
 */
function injectText(obj: any, vars: any) {
    if (!obj || typeof obj !== "object") return obj;

    const isText =
        obj.type === "text" ||
        obj.type === "i-text" ||
        obj.type === "textbox";

    if (!isText) return obj;

    // 🔹 Custom roles
    if (obj.customRole === "brandName") {
        obj.text = vars.BRAND_NAME || obj.text;
        return obj;
    }

    if (obj.customRole === "tagline") {
        obj.text = vars.TAGLINE || obj.text;
        return obj;
    }

    // 🔹 Placeholder replacement
    if (typeof obj.text === "string") {
        obj.text = obj.text
            .replace(/{{\s*BRAND_NAME\s*}}/gi, vars.BRAND_NAME ?? "")
            .replace(/{{\s*TAGLINE\s*}}/gi, vars.TAGLINE ?? "");
    }

    return obj;
}
