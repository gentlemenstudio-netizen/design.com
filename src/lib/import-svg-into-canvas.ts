import { fabric } from "fabric";

function getArtboard(canvas: fabric.Canvas): fabric.Rect | undefined {
    return canvas.getObjects().find(
        (o) => o.type === "rect" && (o as any).name === "clip"
    ) as fabric.Rect | undefined;
}

export function loadSvgIntoCanvas(
    canvas: fabric.Canvas,
    svg: string
) {
    fabric.loadSVGFromString(svg, (objects, options) => {
        if (!objects || !objects.length) return;

        const artboard = getArtboard(canvas);
        if (!artboard) return;

        // 1️⃣ Force group
        const rawGroup =
            fabric.util.groupSVGElements(objects, options) instanceof fabric.Group
                ? (fabric.util.groupSVGElements(objects, options) as fabric.Group)
                : new fabric.Group([fabric.util.groupSVGElements(objects, options)]);

        // 2️⃣ UNGROUP to measure REAL bounds
        const items = rawGroup.getObjects();

        let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;

        items.forEach((obj) => {
            const rect = obj.getBoundingRect(true, true);
            minX = Math.min(minX, rect.left);
            minY = Math.min(minY, rect.top);
            maxX = Math.max(maxX, rect.left + rect.width);
            maxY = Math.max(maxY, rect.top + rect.height);
        });

        // 3️⃣ Normalize all paths to (0,0)
        items.forEach((obj) => {
            obj.left! -= minX;
            obj.top! -= minY;
            obj.setCoords();
        });

        // 4️⃣ Create FINAL clean group
        const group = new fabric.Group(items, {
            originX: "center",
            originY: "center",
            left: 0,
            top: 0,
            selectable: true,
        });

        // 5️⃣ Scale safely to artboard
        const padding = 0.8;
        const targetW = artboard.width! * padding;
        const targetH = artboard.height! * padding;

        if (group.width! > group.height!) {
            group.scaleToWidth(targetW);
        } else {
            group.scaleToHeight(targetH);
        }

        // 6️⃣ Center in artboard
        group.set({
            left: artboard.left! + artboard.width! / 2,
            top: artboard.top! + artboard.height! / 2,
        });

        // 7️⃣ Metadata for logo engine
        (group as any).customType = "logoIcon";

        group.getObjects().forEach((obj, i) => {
            (obj as any).customRole = "iconPath";
            (obj as any).paletteIndex = i;
            if ((obj as any).fill == null) obj.set("fill", "#000");
        });

        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.requestRenderAll();
    });
}
