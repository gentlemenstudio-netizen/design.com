import { fabric } from "fabric";

export function applyIconPaletteToJson(
    json: any,
    colors: string[]
) {
    const cloned = JSON.parse(JSON.stringify(json));

    const group = cloned.objects?.find(
        (o: any) => o.type === "group"
    );

    if (!group?.objects) return cloned;

    const uniqueColors: string[] = [];
    group.objects.forEach((obj: any) => {
        if (obj.fill && !uniqueColors.includes(obj.fill)) {
            uniqueColors.push(obj.fill);
        }
    });

    group.objects.forEach((obj: any) => {
        const index = uniqueColors.indexOf(obj.fill);
        if (index !== -1) {
            obj.fill = colors[index % colors.length];
        }
    });

    return cloned;
}
