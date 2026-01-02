import { fabric } from "fabric";

export async function normalizeTemplate(json: any) {
    const canvas = new fabric.StaticCanvas(null);

    // Wait for Fabric to finish loading JSON
    await new Promise<void>((resolve) => {
        canvas.loadFromJSON(json, () => {
            resolve();
        });
    });

    const objects = canvas.getObjects();
    if (!objects.length) return json;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    objects.forEach((obj) => {
        const rect = obj.getBoundingRect(true, true);
        minX = Math.min(minX, rect.left);
        minY = Math.min(minY, rect.top);
        maxX = Math.max(maxX, rect.left + rect.width);
        maxY = Math.max(maxY, rect.top + rect.height);
    });

    const width = maxX - minX;
    const height = maxY - minY;

    // Reposition objects into canvas bounds
    objects.forEach((obj) => {
        obj.left = (obj.left ?? 0) - minX;
        obj.top = (obj.top ?? 0) - minY;
        obj.setCoords();
    });

    return {
        ...json,
        width,
        height,
        objects: canvas.toJSON().objects,
    };
}
