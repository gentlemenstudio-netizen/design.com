import { injectTemplateVariables } from "@/lib/inject-template";
import { loadTemplateById } from "@/lib/load-template-by-id";
import { Editor } from "@/features/editor/components/editor";

interface EditorNewPageProps {
    searchParams: {
        template?: string;
        brand?: string;
    };
}

const DEFAULT_SIZE = {
    width: 800,
    height: 800,
};

export default function EditorNewPage({
    searchParams,
}: EditorNewPageProps) {
    const templateId = searchParams.template;
    const brand = searchParams.brand || "Your Brand";

    if (!templateId) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground">
                No template selected
            </div>
        );
    }

    const template = loadTemplateById("logo", templateId);

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
}
