import fs from "fs";
import path from "path";

export function loadTemplates(type: "logo") {
    const dir = path.join(process.cwd(), "templates", type);
    const files = fs.readdirSync(dir);

    return files.map((file) => {
        const content = fs.readFileSync(
            path.join(dir, file),
            "utf-8"
        );

        return {
            id: file.replace(".json", ""),
            canvas: JSON.parse(content),
        };
    });
}
