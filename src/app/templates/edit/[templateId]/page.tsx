import { notFound } from "next/navigation";
import { Editor } from "@/features/editor/components/editor";
import { getTemplateById } from "@/lib/templates";

interface Props {
    params: { templateId: string };
}

export default async function EditTemplatePage({ params }: Props) {
    const template = await getTemplateById(params.templateId);

    if (!template) return notFound();

    return (
        <Editor
            initialData={{
                id: template.id,
                json: JSON.stringify(template.json),
                width: template.width,
                height: template.height,
                name: template.name,
                userId: "temp",
                thumbnailUrl: null,
                isTemplate: false,
                isPro: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }}
            mode="template"
        />
    );
}
