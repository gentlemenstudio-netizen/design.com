import { fabric } from "fabric";

export function loadSvgIntoCanvas(
    canvas: fabric.Canvas,
    svg: string
) {
    fabric.loadSVGFromString(svg, (objects, options) => {
        if (!objects || !objects.length) return;

        // 🔑 ALWAYS wrap in a Group
        const group = new fabric.Group(objects, {
            left: canvas.getWidth()! / 2,
            top: canvas.getHeight()! / 2,
            originX: "center",
            originY: "center",
            selectable: true,
        });
        group.set({
            customType: "logoIcon",
            selectable: true,
        });

        // 🔑 Mark as logo icon
        group.customType = "logoIcon";

        // 🔑 Normalize all children for recoloring
        group.getObjects().forEach((obj: fabric.Object, index: number) => {
            obj.customRole = "iconPath";
            obj.paletteIndex = index;

            // Ensure fill exists
            if ((obj as any).fill === undefined) {
                obj.set("fill", "#000");
            }
        });

        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.requestRenderAll();
    });
}
