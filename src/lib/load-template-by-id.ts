import fs from "fs";
import path from "path";

export function loadTemplateById(
    type: "logo",
    id: string
) {
    const filePath = path.join(
        process.cwd(),
        "templates",
        type,
        `${id}.json`
    );

    const file = fs.readFileSync(filePath, "utf-8");

    return {
        id,
        json: JSON.parse(file),
    };
}
