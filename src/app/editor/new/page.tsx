"use client";

import { useSearchParams } from "next/navigation";
import { Editor } from "@/features/editor/components/editor";
import { injectTemplateVariables } from "@/lib/inject-template";
import { loadTemplateById } from "@/lib/load-template-by-id";


const DEFAULT_SIZE = {
    width: 800,
    height: 800,
};

const EditorNewPage = () => {
    const searchParams = useSearchParams();

    const templateId = searchParams.get("template");
    const brand = searchParams.get("brand") || "Your Brand";

    if (!templateId) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground">
                No template selected
            </div>
        );
    }

    // Load JSON from /templates/logo/*.json
    const template = loadTemplateById("logo", templateId);

    // Inject dynamic values
    const injectedJson = injectTemplateVariables(
        template.json,
        { BRAND_NAME: brand }
    );

    return (
        <Editor
            initialData={{
                id: "new",
                name: `${brand} Logo`,
                userId: "temp",
                json: JSON.stringify(injectedJson),
                width: DEFAULT_SIZE.width,
                height: DEFAULT_SIZE.height,
                thumbnailUrl: null,
                isTemplate: false,
                isPro: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }}
        />
    );
};

export default EditorNewPage;
